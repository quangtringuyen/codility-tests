# Frontend Deployment Options for NAS

## Current Status

✅ Backend is deployed via Docker Compose on NAS (port 8089)
✅ Frontend code is committed and pushed to GitHub
⏳ Frontend needs deployment strategy

## Option 1: Separate Frontend Container (Recommended)

Add a frontend service to your `docker-compose.yml`:

### Step 1: Create Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Create nginx.conf

Create `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to backend
    location /api {
        proxy_pass http://web:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Step 3: Update docker-compose.yml

Add this service to your `docker-compose.yml`:

```yaml
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: codility-frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - web
    networks:
      - codility-network
    environment:
      - VITE_API_URL=http://192.168.1.7:8089/api
```

### Step 4: Update frontend .env

Update `frontend/.env.example` and create `frontend/.env`:

```env
VITE_API_URL=/api
```

Note: We use `/api` because nginx will proxy it to the backend.

### Step 5: Deploy

```bash
# On NAS
cd /volume1/docker/codility-tracker
git pull origin main
sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d
```

### Access

- **Frontend**: http://192.168.1.7:3000
- **Backend API**: http://192.168.1.7:8089 (or via frontend proxy at /api)

---

## Option 2: Serve Frontend from Flask (Simpler)

### Step 1: Build Frontend

```bash
# On your Mac
cd frontend
npm run build
```

### Step 2: Update Flask app.py

Add this to your `app.py`:

```python
import os
from flask import send_from_directory

# Serve React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    frontend_dist = os.path.join(os.path.dirname(__file__), 'frontend', 'dist')
    
    if path and os.path.exists(os.path.join(frontend_dist, path)):
        return send_from_directory(frontend_dist, path)
    else:
        return send_from_directory(frontend_dist, 'index.html')
```

### Step 3: Update Dockerfile

Modify your `Dockerfile` to include Node.js and build the frontend:

```dockerfile
FROM python:3.11-slim

# Install Node.js
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend and build
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci
COPY frontend/ .
RUN npm run build

# Copy backend code
WORKDIR /app
COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

### Step 4: Deploy

```bash
# On NAS
cd /volume1/docker/codility-tracker
git pull origin main
sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d
```

### Access

- **Application**: http://192.168.1.7:8089 (serves both frontend and API)

---

## Option 3: Development Mode on NAS

For development, you can run the frontend dev server on NAS:

### Step 1: SSH to NAS

```bash
ssh quangtringuyen@192.168.1.7
```

### Step 2: Install Node.js on NAS (if not installed)

```bash
# Check if Node.js is installed
node --version

# If not, install via Synology Package Center or manually
```

### Step 3: Run Frontend Dev Server

```bash
cd /volume1/docker/codility-tracker/frontend
npm install
npm run dev -- --host
```

### Access

- **Frontend**: http://192.168.1.7:5173
- **Backend**: http://192.168.1.7:8089

---

## Recommendation

**For Production**: Use **Option 1** (Separate Frontend Container)
- Clean separation of concerns
- Nginx serves static files efficiently
- Easy to scale independently
- Professional setup

**For Quick Testing**: Use **Option 2** (Flask serves frontend)
- Simpler deployment
- Single container
- Good for small apps

**For Development**: Use **Option 3** (Dev server)
- Hot reload
- Fast iteration
- Easy debugging

---

## Next Steps

1. Choose your deployment option
2. Follow the steps for that option
3. Update the necessary files
4. Commit and push changes
5. Deploy to NAS
6. Test the application

Let me know which option you'd like to implement!
