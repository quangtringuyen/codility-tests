from flask import Flask, render_template, request, redirect, url_for, jsonify, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from functools import wraps
import os
import markdown
from pathlib import Path

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///codility_progress.db')
if app.config['SQLALCHEMY_DATABASE_URI'].startswith('postgres://'):
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace('postgres://', 'postgresql://', 1)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'

# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class DayProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    week = db.Column(db.Integer, nullable=False)
    day = db.Column(db.Integer, nullable=False)
    completed = db.Column(db.Boolean, default=False)
    notes = db.Column(db.Text, default='')
    completed_date = db.Column(db.DateTime)

class TaskProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    week = db.Column(db.Integer, nullable=False)
    day = db.Column(db.Integer, nullable=False)
    task_name = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    score = db.Column(db.Integer)
    notes = db.Column(db.Text, default='')

# Admin required decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

# Training plan data structure
TRAINING_PLAN = {
    1: {
        'title': 'WEEK 1 – Foundations (TypeScript + Basic DSA)',
        'focus': 'loops, arrays, functions, time complexity',
        'days': {
            1: {
                'title': 'TypeScript Language Basics',
                'topics': ['Functions', 'Arrays & objects', 'For / while loops'],
                'tasks': ['10 small array manipulations']
            },
            2: {
                'title': 'Big-O (Beginner Level)',
                'topics': ['O(n), O(n²), O(log n)', 'Recognize slow vs fast solutions'],
                'tasks': ['Binary Gap']
            },
            3: {
                'title': 'Arrays I',
                'topics': [],
                'tasks': ['OddOccurrencesInArray', 'CyclicRotation']
            },
            4: {
                'title': 'Arrays II',
                'topics': [],
                'tasks': ['Two Sum (LeetCode Easy)', 'Remove Duplicates (LC Easy)']
            },
            5: {
                'title': 'Reading Problems + Working With Edge cases',
                'topics': ['Practice identifying edge cases'],
                'tasks': ['TapeEquilibrium', 'PermMissingElem']
            },
            6: {
                'title': 'Review + Fix Weakness',
                'topics': ['Focus on speed + correctness'],
                'tasks': ['Do 3–4 easy tasks again']
            },
            7: {
                'title': 'REST',
                'topics': ['Take a break!'],
                'tasks': []
            }
        }
    },
    2: {
        'title': 'WEEK 2 – Counting, Prefix Sum & Hash Maps',
        'focus': 'Codility Lesson 3–5, hash maps in TypeScript',
        'days': {
            8: {
                'title': 'Counting Elements',
                'topics': ['boolean arrays vs hash maps'],
                'tasks': ['PermCheck', 'FrogJmp']
            },
            9: {
                'title': 'Counting Practice',
                'topics': [],
                'tasks': ['MissingInteger', 'FrogRiverOne']
            },
            10: {
                'title': 'Prefix Sums (Very Important)',
                'topics': ['Prefix sum logic'],
                'tasks': ['GenomicRangeQuery']
            },
            11: {
                'title': 'Prefix Sums II',
                'topics': ['Subarray sums'],
                'tasks': ['LeetCode: Range Sum Query']
            },
            12: {
                'title': 'Hash Map Practice',
                'topics': ['Review TypeScript Map vs Object'],
                'tasks': ['LC: Contains Duplicate', 'LC: First Unique Character']
            },
            13: {
                'title': 'Mini Review',
                'topics': ['Revisit prefix sums'],
                'tasks': ['Redo MissingInteger fast', 'Redo FrogRiverOne']
            },
            14: {
                'title': 'MOCK TEST (45 min)',
                'topics': ['Target: 70%+'],
                'tasks': ['OddOccurrencesInArray', 'FrogRiverOne', 'TapeEquilibrium']
            }
        }
    },
    3: {
        'title': 'WEEK 3 – Sorting, Greedy & Basic Math',
        'focus': 'sort, compare, greedy patterns',
        'days': {
            15: {'title': 'Sorting', 'topics': [], 'tasks': ['Distinct', 'MaxProductOfThree']},
            16: {'title': 'Sorting II', 'topics': [], 'tasks': ['Triangle', 'Number of intersections (optional)']},
            17: {'title': 'Greedy Algorithms', 'topics': [], 'tasks': ['TapeEquilibrium', 'TieRopes']},
            18: {'title': 'Simple Math in DSA', 'topics': [], 'tasks': ['CountDiv', 'PassingCars']},
            19: {'title': 'Extra Sorting Practice', 'topics': [], 'tasks': ['LC: Merge Sorted Array', 'LC: Sort Colors']},
            20: {'title': 'Review', 'topics': ['Optimize speed'], 'tasks': ['Redo 3 solved tasks']},
            21: {'title': 'MOCK TEST (60 min)', 'topics': ['Target: 75%+'], 'tasks': ['Distinct', 'MaxProductOfThree', 'FrogRiverOne']}
        }
    },
    4: {
        'title': 'WEEK 4 – Stacks, Queues, Leaders (Major Week)',
        'focus': 'stack patterns, dominance, StoneWall',
        'days': {
            22: {'title': 'Stacks', 'topics': [], 'tasks': ['Brackets', 'LC: Valid Parentheses']},
            23: {'title': 'Stack Simulation', 'topics': [], 'tasks': ['Fish', 'StoneWall (VERY common!)']},
            24: {'title': 'Leaders & Dominator', 'topics': [], 'tasks': ['Dominator', 'EquiLeader']},
            25: {'title': 'Stacks & Queues Review', 'topics': [], 'tasks': ['Redo Fish', 'Redo StoneWall']},
            26: {'title': 'Hard Stack Practice', 'topics': [], 'tasks': ['LC: Daily Temperatures (optional)', 'Redo Brackets']},
            27: {'title': 'Review', 'topics': [], 'tasks': ['Focus StoneWall + EquiLeader']},
            28: {'title': 'MOCK TEST (70 min)', 'topics': ['Target: 80%+'], 'tasks': ['Brackets', 'StoneWall', 'Dominator']}
        }
    },
    5: {
        'title': 'WEEK 5 – Maximum Slices + DP Basics',
        'focus': 'max subarray, max double slice, DP for Codility',
        'days': {
            29: {'title': 'Kadane\'s Algorithm', 'topics': [], 'tasks': ['MaxSliceSum', 'MaxProfit']},
            30: {'title': 'Max Double Slice', 'topics': ['Handle negative cases'], 'tasks': ['MaxDoubleSliceSum']},
            31: {'title': 'DP Basics (Beginner Friendly)', 'topics': ['What is DP', 'Subproblems, transitions, recursion → iteration'], 'tasks': []},
            32: {'title': 'DP Practice', 'topics': [], 'tasks': ['NumberSolitaire']},
            33: {'title': 'DP Review', 'topics': [], 'tasks': ['Redo MaxSliceSum', 'Redo MaxProfit']},
            34: {'title': 'Review', 'topics': [], 'tasks': ['Focus MaxDoubleSliceSum']},
            35: {'title': 'MOCK TEST (75 min)', 'topics': ['Target: 80–85%'], 'tasks': ['MaxSliceSum', 'MaxProfit', 'MaxDoubleSliceSum']}
        }
    },
    6: {
        'title': 'WEEK 6 – Binary Search, Peaks, Flags, Sieve',
        'focus': 'harder Codility topics',
        'days': {
            36: {'title': 'Binary Search', 'topics': ['Apply binary search to problems'], 'tasks': ['BinaryGap review', 'MinMaxDivision (optional)']},
            37: {'title': 'Sieve of Eratosthenes', 'topics': [], 'tasks': ['CountFactors', 'CountSemiprimes']},
            38: {'title': 'Peaks', 'topics': ['Practice subarray decomposition'], 'tasks': ['Peaks']},
            39: {'title': 'Flags', 'topics': ['Hard but extremely common'], 'tasks': ['Flags']},
            40: {'title': 'Rectangle / Geometry', 'topics': [], 'tasks': ['MinPerimeterRectangle', 'ChocolatesByNumbers']},
            41: {'title': 'Review', 'topics': [], 'tasks': ['Redo Flags', 'Redo Peaks']},
            42: {'title': 'MOCK TEST (75–90 min)', 'topics': ['Target: 85%+'], 'tasks': ['Flags', 'CountFactors', 'MaxSliceSum']}
        }
    },
    7: {
        'title': 'WEEK 7 – Reinforcement + Mid/Hard LeetCode',
        'focus': 'fill gaps + strengthen thinking',
        'days': {
            43: {'title': 'Array Medium Review', 'topics': [], 'tasks': ['LC Medium array', 'LC Medium greedy']},
            44: {'title': 'Array Medium Review (cont.)', 'topics': [], 'tasks': ['Continue LC Medium problems']},
            45: {'title': 'Stack & Leader Review', 'topics': [], 'tasks': ['StoneWall', 'Fish', 'EquiLeader']},
            46: {'title': 'Binary Search Review', 'topics': [], 'tasks': ['Flags', 'Peaks']},
            47: {'title': 'Prefix Sum Review', 'topics': [], 'tasks': ['GenomicRangeQuery', 'MissingInteger']},
            48: {'title': 'Mini Mock Test (60 min)', 'topics': ['Target: 90% on easier ones, 75% on hard ones'], 'tasks': ['3 medium tasks mixed']},
            49: {'title': 'Free Review Day', 'topics': ['Redo anything difficult'], 'tasks': []}
        }
    },
    8: {
        'title': 'WEEK 8 – Final Codility Simulation Week',
        'focus': 'simulate real exam conditions',
        'days': {
            51: {'title': 'Full Mock Test A (90 min)', 'topics': [], 'tasks': ['StoneWall', 'MaxDoubleSliceSum', 'TapeEquilibrium']},
            52: {'title': 'Review results', 'topics': [], 'tasks': ['Analyze Mock Test A']},
            53: {'title': 'Full Mock Test B (90 min)', 'topics': [], 'tasks': ['Fish', 'Flags', 'PermMissingElem']},
            54: {'title': 'Review', 'topics': [], 'tasks': ['Analyze Mock Test B']},
            55: {'title': 'Full Mock Test C (90 min)', 'topics': [], 'tasks': ['MaxProfit', 'GenomicRangeQuery', 'Dominator']},
            56: {'title': 'Final Self-Assessment', 'topics': ['Goal: 85–90% correctness + optimized performance'], 'tasks': []}
        }
    }
}

# Routes
@app.route('/')
def index():
    stats = get_overall_stats()
    return render_template('index.html', weeks=TRAINING_PLAN, stats=stats)

@app.route('/week/<int:week_num>')
def week_view(week_num):
    if week_num not in TRAINING_PLAN:
        return redirect(url_for('index'))

    week_data = TRAINING_PLAN[week_num]
    progress_data = {}

    for day_num in week_data['days'].keys():
        day_progress = DayProgress.query.filter_by(week=week_num, day=day_num).first()
        task_progress = TaskProgress.query.filter_by(week=week_num, day=day_num).all()
        progress_data[day_num] = {
            'day_completed': day_progress.completed if day_progress else False,
            'notes': day_progress.notes if day_progress else '',
            'tasks': {tp.task_name: {'completed': tp.completed, 'score': tp.score} for tp in task_progress}
        }

    return render_template('week.html', week_num=week_num, week_data=week_data, progress=progress_data)

@app.route('/api/toggle_day', methods=['POST'])
def toggle_day():
    data = request.json
    week = data.get('week')
    day = data.get('day')

    day_progress = DayProgress.query.filter_by(week=week, day=day).first()
    if not day_progress:
        day_progress = DayProgress(week=week, day=day)
        db.session.add(day_progress)

    day_progress.completed = not day_progress.completed
    day_progress.completed_date = datetime.now() if day_progress.completed else None
    db.session.commit()

    return jsonify({'success': True, 'completed': day_progress.completed})

@app.route('/api/update_notes', methods=['POST'])
def update_notes():
    data = request.json
    week = data.get('week')
    day = data.get('day')
    notes = data.get('notes', '')

    day_progress = DayProgress.query.filter_by(week=week, day=day).first()
    if not day_progress:
        day_progress = DayProgress(week=week, day=day)
        db.session.add(day_progress)

    day_progress.notes = notes
    db.session.commit()

    return jsonify({'success': True})

@app.route('/api/toggle_task', methods=['POST'])
def toggle_task():
    data = request.json
    week = data.get('week')
    day = data.get('day')
    task_name = data.get('task_name')

    task_progress = TaskProgress.query.filter_by(week=week, day=day, task_name=task_name).first()
    if not task_progress:
        task_progress = TaskProgress(week=week, day=day, task_name=task_name)
        db.session.add(task_progress)

    task_progress.completed = not task_progress.completed
    db.session.commit()

    return jsonify({'success': True, 'completed': task_progress.completed})

@app.route('/api/update_task_score', methods=['POST'])
def update_task_score():
    data = request.json
    week = data.get('week')
    day = data.get('day')
    task_name = data.get('task_name')
    score = data.get('score')

    task_progress = TaskProgress.query.filter_by(week=week, day=day, task_name=task_name).first()
    if not task_progress:
        task_progress = TaskProgress(week=week, day=day, task_name=task_name)
        db.session.add(task_progress)

    task_progress.score = score
    db.session.commit()

    return jsonify({'success': True})

def get_overall_stats():
    total_days = sum(len(week['days']) for week in TRAINING_PLAN.values())
    completed_days = DayProgress.query.filter_by(completed=True).count()

    total_tasks = 0
    for week in TRAINING_PLAN.values():
        for day in week['days'].values():
            total_tasks += len(day['tasks'])

    completed_tasks = TaskProgress.query.filter_by(completed=True).count()

    return {
        'total_days': total_days,
        'completed_days': completed_days,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'progress_percentage': int((completed_days / total_days) * 100) if total_days > 0 else 0
    }

# Playground route
@app.route('/playground')
def playground():
    """TypeScript code playground"""
    return render_template('playground.html')

# Lessons routes
@app.route('/lessons')
def lessons_index():
    """Display all available lessons"""
    lessons_dir = Path(__file__).parent / 'lessons'

    lessons_list = [
        {'file': 'README.md', 'title': 'Lessons Overview', 'week': 0},
        {'file': 'CHEAT_SHEET.md', 'title': 'Pattern Cheat Sheet', 'week': 0},
        {'file': 'week1-foundations.md', 'title': 'Week 1: Foundations', 'week': 1},
        {'file': 'week2-counting-prefix-hashmaps.md', 'title': 'Week 2: Counting & Prefix Sums', 'week': 2},
        {'file': 'week3-sorting-greedy-math.md', 'title': 'Week 3: Sorting & Greedy', 'week': 3},
        {'file': 'week4-stacks-queues-leaders.md', 'title': 'Week 4: Stacks & Leaders', 'week': 4},
        {'file': 'week5-slices-dp.md', 'title': 'Week 5: Maximum Slices & DP', 'week': 5},
        {'file': 'week6-binary-search-peaks-sieve.md', 'title': 'Week 6: Binary Search & Sieve', 'week': 6},
        {'file': 'week7-review-practice.md', 'title': 'Week 7: Review & Practice', 'week': 7},
        {'file': 'week8-final-mocks.md', 'title': 'Week 8: Final Mock Tests', 'week': 8},
    ]

    return render_template('lessons.html', lessons=lessons_list)

@app.route('/lessons/<lesson_file>')
def view_lesson(lesson_file):
    """Display a specific lesson with markdown rendered as HTML"""
    lessons_dir = Path(__file__).parent / 'lessons'
    lesson_path = lessons_dir / lesson_file

    # Security: prevent directory traversal
    if not lesson_path.is_file() or '..' in lesson_file:
        return "Lesson not found", 404

    try:
        with open(lesson_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Convert markdown to HTML with extensions
        md = markdown.Markdown(extensions=['extra', 'codehilite', 'toc', 'fenced_code'])
        html_content = md.convert(content)

        # Extract title from first heading
        title = lesson_file.replace('.md', '').replace('-', ' ').title()
        if content.startswith('#'):
            title = content.split('\n')[0].replace('#', '').strip()

        # Get all lessons for navigation
        lessons_list = [
            {'file': 'README.md', 'title': 'Lessons Overview', 'week': 0},
            {'file': 'CHEAT_SHEET.md', 'title': 'Pattern Cheat Sheet', 'week': 0},
            {'file': 'week1-foundations.md', 'title': 'Week 1: Foundations', 'week': 1},
            {'file': 'week2-counting-prefix-hashmaps.md', 'title': 'Week 2: Counting & Prefix Sums', 'week': 2},
            {'file': 'week3-sorting-greedy-math.md', 'title': 'Week 3: Sorting & Greedy', 'week': 3},
            {'file': 'week4-stacks-queues-leaders.md', 'title': 'Week 4: Stacks & Leaders', 'week': 4},
            {'file': 'week5-slices-dp.md', 'title': 'Week 5: Maximum Slices & DP', 'week': 5},
            {'file': 'week6-binary-search-peaks-sieve.md', 'title': 'Week 6: Binary Search & Sieve', 'week': 6},
            {'file': 'week7-review-practice.md', 'title': 'Week 7: Review & Practice', 'week': 7},
            {'file': 'week8-final-mocks.md', 'title': 'Week 8: Final Mock Tests', 'week': 8},
        ]

        # Find current lesson index
        current_index = next((i for i, l in enumerate(lessons_list) if l['file'] == lesson_file), None)

        # Get prev/next lessons
        prev_lesson = lessons_list[current_index - 1] if current_index and current_index > 0 else None
        next_lesson = lessons_list[current_index + 1] if current_index is not None and current_index < len(lessons_list) - 1 else None

        return render_template('lesson_view.html',
                             title=title,
                             content=html_content,
                             markdown_content=content,
                             lesson_file=lesson_file,
                             prev_lesson=prev_lesson,
                             next_lesson=next_lesson)
    except Exception as e:
        return f"Error loading lesson: {str(e)}", 500

@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login"""
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            login_user(user, remember=True)
            flash('Logged in successfully!', 'success')
            next_page = request.args.get('next')
            return redirect(next_page or url_for('index'))
        else:
            flash('Invalid username or password', 'error')

    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    """User logout"""
    logout_user()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('index'))

@app.route('/api/save_lesson', methods=['POST'])
@admin_required
def save_lesson():
    """Save edited lesson content - Admin only"""
    data = request.json
    lesson_file = data.get('lesson_file')
    content = data.get('content')

    lessons_dir = Path(__file__).parent / 'lessons'
    lesson_path = lessons_dir / lesson_file

    # Security: prevent directory traversal
    if '..' in lesson_file or not lesson_file.endswith('.md'):
        return jsonify({'success': False, 'error': 'Invalid lesson file'}), 400

    try:
        with open(lesson_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/get_lesson_content', methods=['GET'])
def get_lesson_content():
    """Get raw markdown content for editing"""
    lesson_file = request.args.get('lesson_file')
    lessons_dir = Path(__file__).parent / 'lessons'
    lesson_path = lessons_dir / lesson_file

    # Security: prevent directory traversal
    if '..' in lesson_file or not lesson_file.endswith('.md'):
        return jsonify({'success': False, 'error': 'Invalid lesson file'}), 400

    try:
        with open(lesson_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return jsonify({'success': True, 'content': content})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
