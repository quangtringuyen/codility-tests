# Docker Quick Start Guide

Quick reference for running the Codility Training Tracker with Docker.

## Prerequisites

- Docker and Docker Compose installed
- This project cloned/downloaded

## Quick Start (PostgreSQL)

```bash
# 1. Build and start containers
docker-compose build
docker-compose up -d

# 2. Check status
docker-compose ps
docker-compose logs -f web

# 3. Access app
# Open browser: http://localhost:5000
```

That's it! Your app is running with PostgreSQL.

## Quick Start (SQLite - Simpler)

If you want to avoid PostgreSQL complexity:

1. Edit `docker-compose.yml` and change the DATABASE_URL:
   ```yaml
   environment:
     DATABASE_URL: sqlite:///codility_progress.db
   ```

2. Remove or comment out the postgres service in docker-compose.yml

3. Run:
   ```bash
   docker-compose up -d
   ```

## Common Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f web
docker-compose logs -f postgres

# Rebuild after code changes
docker-compose build
docker-compose up -d

# Complete rebuild (clean slate)
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Access database
docker exec -it codility-postgres psql -U codility_user -d codility_tracker
```

## Troubleshooting

### "ModuleNotFoundError: No module named 'psycopg2'"

**Solution:**
```bash
# Rebuild with Dockerfile
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verify psycopg2 is installed
docker exec codility-web python -c "import psycopg2; print('OK')"
```

### Port 5000 already in use

Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:5000"  # Use port 8080 instead
```

### Database connection errors

```bash
# Check if PostgreSQL is ready
docker exec codility-postgres pg_isready -U codility_user

# View PostgreSQL logs
docker-compose logs postgres
```

### Reset everything

```bash
# Complete reset (deletes all data!)
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## What's Included

### Dockerfile
- Based on Python 3.11-slim
- Installs PostgreSQL client libraries
- Installs all Python dependencies from requirements.txt
- Includes psycopg2-binary for PostgreSQL support

### docker-compose.yml
- PostgreSQL 15 database
- Flask web application
- Automatic database initialization
- Persistent data volumes
- Health checks

## Environment Variables

You can customize these in `docker-compose.yml`:

- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: Flask secret key (change in production!)
- `FLASK_ENV`: Set to 'production' or 'development'

## For Synology NAS

See [SYNOLOGY_DEPLOYMENT.md](SYNOLOGY_DEPLOYMENT.md) for detailed instructions on deploying to Synology NAS.

## For Production

1. **Change passwords** in docker-compose.yml
2. **Generate strong SECRET_KEY**:
   ```bash
   python -c 'import secrets; print(secrets.token_hex(32))'
   ```
3. **Use environment file** for secrets (.env)
4. **Set up backups** for PostgreSQL data
5. **Configure reverse proxy** for HTTPS

## Files Overview

```
codility-tests/
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Multi-container setup
├── .dockerignore          # Files to exclude from image
├── requirements.txt       # Python dependencies (includes psycopg2-binary)
├── app.py                 # Flask application
└── ...
```

## Notes

- PostgreSQL data is stored in Docker volume `postgres_data`
- Web app code is mounted from your local directory (changes reflect immediately with `--reload`)
- First startup takes longer (building image, initializing database)
- Subsequent startups are fast

## Need Help?

- See [SYNOLOGY_DEPLOYMENT.md](SYNOLOGY_DEPLOYMENT.md) for Synology NAS
- See [DEPLOYMENT.md](DEPLOYMENT.md) for cloud hosting options
- See [README.md](README.md) for general information

---

**Happy Coding!** Start your 8-week Codility training journey! 🚀
