import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { LogOut } from 'lucide-react'

export default function Dashboard() {
    const { user, isAuthenticated, logout } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        }
    }, [isAuthenticated, navigate])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Codility Tracker
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                                Welcome, <span className="font-semibold">{user?.username}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        Dashboard
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                        Welcome to your new React + TypeScript frontend! 🎉
                    </p>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Tech Stack</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">React 18 + TypeScript 5</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-700">
                            <h3 className="font-semibold text-purple-900 dark:text-purple-100">Styling</h3>
                            <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">TailwindCSS + Radix UI</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-700">
                            <h3 className="font-semibold text-green-900 dark:text-green-100">State</h3>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-2">Zustand + React Query</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
