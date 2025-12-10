# Codility Tracker - Frontend

Modern React + TypeScript frontend for the Codility Training Tracker.

## 🚀 Tech Stack

- **Framework**: React 18+ with TypeScript 5+
- **Build Tool**: Vite 7+ (fast dev server, HMR)
- **Styling**: TailwindCSS 3+ with Radix UI components
- **State Management**: 
  - Zustand for client state
  - TanStack React Query for server state
- **Routing**: React Router DOM 6+
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Notifications**: Sonner (toast notifications)

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your API URL if different from default
```

## 🛠️ Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components (Login, Dashboard, etc.)
├── hooks/          # Custom React hooks
├── stores/         # Zustand stores
├── services/       # API services and utilities
├── types/          # TypeScript type definitions
├── lib/            # Utility functions
└── App.tsx         # Main app component with routing
```

## 🔐 Authentication

The app uses Zustand for client-side auth state management with localStorage persistence. The auth token is automatically attached to all API requests via Axios interceptors.

## 🎨 Styling

- TailwindCSS for utility-first styling
- Custom CSS variables for theming (light/dark mode support)
- Radix UI primitives for accessible components

## 🌐 API Integration

The frontend connects to the Flask backend API. Configure the API URL in `.env`:

```env
VITE_API_URL=http://localhost:8089/api
```

## 📝 Available Scripts

- `npm run dev` - Start development server on http://localhost:5173
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚢 Deployment

The frontend can be deployed separately from the backend or served by the Flask app.

### Option 1: Separate Deployment (Recommended)

```bash
# Build the frontend
npm run build

# Deploy the dist/ folder to your hosting service
# (Vercel, Netlify, AWS S3, etc.)
```

### Option 2: Serve from Flask

```bash
# Build the frontend
npm run build

# Copy dist/ contents to Flask's static folder
# Update Flask to serve the React app
```

## 🔧 Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:8089/api)

## 📚 Key Features

- ✅ Type-safe with TypeScript
- ✅ Form validation with Zod
- ✅ Optimistic UI updates
- ✅ Error handling with toast notifications
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Authentication with JWT
- ✅ Protected routes

## 🎯 Next Steps

1. Implement actual API integration (replace mock login)
2. Add more pages (Team, Progress, Settings)
3. Create reusable UI components
4. Add data fetching with React Query
5. Implement charts with Recharts
6. Add animations with Framer Motion
