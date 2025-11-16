# Codility Training Tracker

A comprehensive 8-week Codility training plan tracker built with Python Flask. Track your progress, take notes, and complete mock tests as you prepare for Codility assessments.

## Features

- **8-Week Structured Plan**: Complete training curriculum from basics to advanced topics
- **Progress Tracking**: Mark days and tasks as completed
- **Mock Test Scoring**: Track your scores on practice tests
- **Notes System**: Add notes for each day's learning
- **Responsive Design**: Works on desktop and mobile devices
- **Database Persistence**: Your progress is saved automatically

## Training Plan Overview

1. **Week 1**: Foundations (TypeScript + Basic DSA)
2. **Week 2**: Counting, Prefix Sum & Hash Maps
3. **Week 3**: Sorting, Greedy & Basic Math
4. **Week 4**: Stacks, Queues, Leaders
5. **Week 5**: Maximum Slices + DP Basics
6. **Week 6**: Binary Search, Peaks, Flags, Sieve
7. **Week 7**: Reinforcement + Mid/Hard LeetCode
8. **Week 8**: Final Codility Simulation Week

## Local Installation

### Prerequisites

- Python 3.11 or higher
- pip (Python package manager)

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd codility-tests
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Run the application:
```bash
python app.py
```

6. Open your browser and navigate to:
```
http://localhost:5000
```

## Deployment

Deploy your app for **FREE** to access it from anywhere!

### PythonAnywhere (Recommended - Truly Free Forever!)

**Best free option - No expiration, no credit card required!**

1. Sign up at [pythonanywhere.com](https://www.pythonanywhere.com)
2. Upload code via Git or file upload
3. Create virtual environment and install dependencies
4. Create web app (Flask)
5. Configure WSGI file
6. Deploy!

**Pros**: Free forever, SQLite database never expires, instant startup
**Cons**: Manual deployment (no auto-deploy from GitHub)

### Render (Free web hosting, but database issues)

**⚠️ Warning**: Render's free PostgreSQL **expires after 30 days** and gets deleted!

**Option 1**: Use Render with SQLite + Persistent Disk (recommended if using Render)
**Option 2**: Use PostgreSQL knowing it expires in 30 days

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed Render setup with persistent SQLite.

### Fly.io (Free tier, requires credit card)

- Free tier with PostgreSQL that doesn't expire
- Requires credit card for verification
- CLI-based deployment

### Paid Options

**Railway** - $5/month after trial
**Heroku** - $5/month minimum (no free tier)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions for all platforms.

## Environment Variables

Required environment variables for production:

- `DATABASE_URL`: PostgreSQL connection string (auto-set by most platforms)
- `SECRET_KEY`: Random secret key for Flask sessions
- `FLASK_ENV`: Set to `production`

## Database

The app uses SQLite for local development and PostgreSQL for production. The database schema includes:

- **DayProgress**: Tracks completion status and notes for each day
- **TaskProgress**: Tracks individual task completion and scores

Database tables are automatically created on first run.

## Usage Tips

1. **Start with Week 1**: Follow the plan sequentially for best results
2. **Mark Progress**: Check off tasks as you complete them
3. **Take Notes**: Document your solutions and learnings
4. **Mock Tests**: Record your scores to track improvement
5. **Review Regularly**: Use the dashboard to monitor overall progress

## Technology Stack

- **Backend**: Python Flask
- **Database**: SQLAlchemy (SQLite/PostgreSQL)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: Gunicorn WSGI server

## Contributing

Feel free to fork this project and customize it for your needs. Some ideas:

- Add more programming challenges
- Integrate with Codility API
- Add timer functionality
- Create achievement badges
- Add social features

## License

MIT License - feel free to use this for your training!

## Support

If you encounter issues or have questions:

1. Check the browser console for JavaScript errors
2. Check application logs for server errors
3. Ensure all environment variables are set correctly
4. Verify database connection is working

Good luck with your Codility preparation!
