# Quick Start Guide

Get your Codility Training Tracker up and running in 5 minutes!

## Local Development

### Option 1: Using the run script (Mac/Linux)

```bash
./run.sh
```

That's it! The script will:
- Create virtual environment
- Install dependencies
- Start the Flask app

### Option 2: Manual setup

1. **Create virtual environment**
   ```bash
   python3 -m venv venv
   ```

2. **Activate virtual environment**
   - Mac/Linux: `source venv/bin/activate`
   - Windows: `venv\Scripts\activate`

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the app**
   ```bash
   python app.py
   ```

5. **Open browser**
   Navigate to: http://localhost:5000

## First Time Setup

1. **Access the Dashboard**
   - You'll see 8 weeks of training
   - View overall progress statistics

2. **Start Week 1**
   - Click "View Week" on Week 1
   - See all 7 days with tasks

3. **Track Your Progress**
   - Check off tasks as you complete them
   - Mark days as complete
   - Add notes for each day
   - Record scores on mock tests

## Using the App

### Dashboard Features
- Overview of all 8 weeks
- Progress statistics (days/tasks completed)
- Quick access to each week

### Week View Features
- Daily breakdown of topics and tasks
- Checkbox to mark tasks complete
- Notes section for each day
- Score tracking for mock tests
- Day completion status

### Tips for Success
1. Follow the plan sequentially (Week 1 → Week 8)
2. Spend 2 hours per day consistently
3. Take notes on difficult concepts
4. Redo tasks you struggled with
5. Take mock tests seriously

## Deploy to Production (100% FREE!)

Choose your platform:

### PythonAnywhere (Recommended - Truly Free Forever!)

**No credit card, no expiration, database persists forever!**

1. Sign up at [pythonanywhere.com](https://www.pythonanywhere.com)
2. Upload code via Git: `git clone your-repo-url`
3. Create virtual environment: `mkvirtualenv --python=/usr/bin/python3.10 myenv`
4. Install dependencies: `pip install -r requirements.txt`
5. Create web app → Manual configuration → Python 3.10
6. Configure WSGI file to point to your app
7. Deploy!

**Database**: SQLite (never expires, completely free)

[See DEPLOYMENT.md for detailed instructions](DEPLOYMENT.md)

### Render (Free but with limitations)

**⚠️ WARNING**: PostgreSQL expires after 30 days!

- Use SQLite + Persistent Disk instead
- Free tier sleeps after 15 min (~30 sec wake time)
- Auto-deploy from GitHub

### Other Platforms

- **Fly.io**: Free tier (requires credit card verification)
- **Railway**: $5/month after trial (NOT free)
- **Heroku**: $5/month minimum (NOT free)

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Database errors
```bash
# Delete and recreate database
rm codility_progress.db
python app.py
```

### Import errors
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

### Can't access app in browser
- Check if Flask is running (you should see startup messages)
- Try http://127.0.0.1:5000 instead of localhost
- Check firewall settings

## File Structure

```
codility-tests/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── Procfile              # Heroku configuration
├── runtime.txt           # Python version for deployment
├── .env.example          # Environment variables template
├── templates/            # HTML templates
│   ├── base.html
│   ├── index.html
│   └── week.html
├── static/              # CSS and JavaScript
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
└── codility_progress.db # SQLite database (created on first run)
```

## Next Steps

1. Start with Week 1, Day 1
2. Complete 2 hours of study/practice daily
3. Track your progress in the app
4. Review and redo difficult problems
5. Take all mock tests seriously
6. Deploy to production to access from anywhere!

## Support

- **Documentation**: See README.md for full details
- **Deployment**: See DEPLOYMENT.md for hosting guides
- **Issues**: Check browser console and Flask logs

## Training Plan Overview

- **Week 1**: Foundations (arrays, loops, Big-O)
- **Week 2**: Counting, prefix sums, hash maps
- **Week 3**: Sorting, greedy algorithms, math
- **Week 4**: Stacks, queues, leaders
- **Week 5**: Maximum slices, dynamic programming
- **Week 6**: Binary search, peaks, flags, sieve
- **Week 7**: Reinforcement + medium problems
- **Week 8**: Final mock tests and assessment

Good luck with your Codility preparation!
