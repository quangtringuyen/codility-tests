# Frontend Migration Guide

## Overview

The Codility Tracker frontend has been migrated from Jinja2 templates to a modern React + TypeScript stack.

## ✅ What's Been Completed

### 1. Project Setup
- ✅ Vite 7+ with React 18 and TypeScript 5
- ✅ TailwindCSS 3+ configured with custom theme
- ✅ PostCSS configured for Tailwind processing

### 2. Dependencies Installed
- ✅ **Routing**: `react-router-dom@6+`
- ✅ **State Management**: `zustand` (with persist middleware)
- ✅ **Server State**: `@tanstack/react-query`
- ✅ **Forms**: `react-hook-form` + `zod` + `@hookform/resolvers`
- ✅ **HTTP**: `axios` with interceptors
- ✅ **UI Components**: Radix UI primitives (`@radix-ui/react-*`)
- ✅ **Icons**: `lucide-react`
- ✅ **Animations**: `framer-motion`
- ✅ **Charts**: `recharts`
- ✅ **Notifications**: `sonner`
- ✅ **Utilities**: `clsx`, `tailwind-merge`, `class-variance-authority`

### 3. Core Files Created

#### Configuration
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- `.env.example` - Environment variables template
- `README.md` - Project documentation

#### Source Files
- `src/main.tsx` - App entry point with providers
- `src/App.tsx` - Main app with routing
- `src/index.css` - Global styles with Tailwind

#### Utilities
- `src/lib/utils.ts` - Helper functions (cn for class merging)

#### State Management
- `src/stores/authStore.ts` - Zustand auth store with persistence

#### Services
- `src/services/api.ts` - Axios instance with interceptors

#### Pages
- `src/pages/Login.tsx` - Login page with form validation
- `src/pages/Dashboard.tsx` - Dashboard with auth guard

#### Folder Structure
```
src/
├── components/     # (empty - ready for components)
├── hooks/          # (empty - ready for custom hooks)
├── pages/          # Login, Dashboard
├── stores/         # authStore
├── services/       # api
├── types/          # (empty - ready for types)
└── lib/            # utils
```

## 🎨 Design System

### Color Scheme
The app uses CSS variables for theming with light/dark mode support:
- Primary: Blue-Purple gradient
- Background: Slate tones
- Accent colors for different states

### Components
- Form inputs with focus states
- Gradient buttons with hover effects
- Card layouts with shadows
- Responsive navigation

## 🔐 Authentication Flow

1. User submits login form (validated with Zod)
2. Form data sent to backend API (currently mocked)
3. On success, user + token stored in Zustand
4. Token persisted to localStorage
5. Axios interceptor adds token to all requests
6. Protected routes check auth state
7. 401 responses trigger automatic logout

## 📋 Next Steps

### Immediate Tasks

1. **Connect to Real API**
   ```typescript
   // In src/pages/Login.tsx, replace mock with:
   import api from '../services/api'
   
   const response = await api.post('/auth/login', data)
   login(response.data.user, response.data.token)
   ```

2. **Create Reusable Components**
   - Button component (variants: primary, secondary, outline)
   - Input component (with error states)
   - Card component
   - Modal/Dialog component
   - Table component

3. **Add More Pages**
   - Team Management
   - Progress Tracking
   - User Settings
   - Admin Panel

4. **Implement Data Fetching**
   ```typescript
   // Example with React Query
   import { useQuery } from '@tanstack/react-query'
   import api from '../services/api'
   
   const { data, isLoading } = useQuery({
     queryKey: ['team'],
     queryFn: () => api.get('/team').then(res => res.data)
   })
   ```

5. **Add Charts**
   ```typescript
   import { LineChart, Line, XAxis, YAxis } from 'recharts'
   // Implement progress charts
   ```

### Backend Integration

#### Update Flask to Serve React App

**Option 1: Separate Deployment (Recommended)**
- Deploy React app to Vercel/Netlify
- Keep Flask API separate
- Configure CORS properly

**Option 2: Flask Serves React**
```python
# In app.py
from flask import send_from_directory

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path and os.path.exists(os.path.join('frontend/dist', path)):
        return send_from_directory('frontend/dist', path)
    return send_from_directory('frontend/dist', 'index.html')
```

#### API Endpoints Needed

Create these Flask endpoints:

```python
# Authentication
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

# Team Management
GET    /api/team
POST   /api/team/members
PUT    /api/team/members/:id
DELETE /api/team/members/:id

# Progress Tracking
GET  /api/progress
POST /api/progress
GET  /api/progress/stats

# Daily Challenge
GET /api/daily-challenge
GET /api/daily-challenge/completions
```

#### CORS Configuration

```python
from flask_cors import CORS

CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "https://your-domain.com"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

## 🚀 Development Workflow

### Running Locally

```bash
# Terminal 1: Backend (Flask)
cd /Users/tringuyen/dev/code/codility-tests
python app.py

# Terminal 2: Frontend (React)
cd /Users/tringuyen/dev/code/codility-tests/frontend
npm run dev
```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8089

### Building for Production

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

## 📦 Deployment Options

### Option 1: Vercel (Frontend) + NAS (Backend)

1. **Frontend to Vercel**
   ```bash
   cd frontend
   vercel deploy
   ```

2. **Update .env**
   ```env
   VITE_API_URL=http://your-nas-ip:8089/api
   ```

### Option 2: All on NAS

Update `docker-compose.yml`:

```yaml
services:
  # ... existing postgres and web services ...
  
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: codility-frontend
    restart: always
    ports:
      - "3000:80"
    networks:
      - codility-network
```

Create `frontend/Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🎯 Migration Checklist

- [x] Initialize Vite + React + TypeScript project
- [x] Install all required dependencies
- [x] Configure Tailwind CSS
- [x] Set up routing with React Router
- [x] Create auth store with Zustand
- [x] Configure Axios with interceptors
- [x] Create Login page with validation
- [x] Create Dashboard page
- [x] Set up React Query provider
- [ ] Connect to real backend API
- [ ] Migrate all existing pages
- [ ] Create reusable UI components
- [ ] Implement data fetching with React Query
- [ ] Add charts and visualizations
- [ ] Implement animations
- [ ] Add comprehensive error handling
- [ ] Write unit tests
- [ ] Update deployment configuration
- [ ] Deploy to production

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

## 🐛 Troubleshooting

### Dev Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Styles Not Working
- Check `tailwind.config.js` content paths
- Verify `@tailwind` directives in `index.css`
- Clear Vite cache: `rm -rf node_modules/.vite`

### API Requests Failing
- Check CORS configuration on Flask backend
- Verify `VITE_API_URL` in `.env`
- Check browser console for errors
- Verify backend is running

### Build Errors
```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint
```

---

**Status**: ✅ Frontend foundation complete and ready for development!
**Next**: Connect to backend API and start migrating existing features.
