import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { LogOut, TrendingUp, Target, Award, Zap, Code2, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

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

    const stats = [
        {
            icon: Target,
            label: 'Problems Solved',
            value: '127',
            change: '+12%',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: TrendingUp,
            label: 'Current Streak',
            value: '15 days',
            change: '+3 days',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Award,
            label: 'Achievements',
            value: '24',
            change: '+2 new',
            color: 'from-emerald-500 to-teal-500',
        },
        {
            icon: Zap,
            label: 'Avg. Speed',
            value: '45 min',
            change: '-5 min',
            color: 'from-orange-500 to-red-500',
        },
    ]

    const recentActivity = [
        { title: 'Two Sum', difficulty: 'Easy', time: '2 hours ago', status: 'completed' },
        { title: 'Binary Tree Traversal', difficulty: 'Medium', time: '5 hours ago', status: 'completed' },
        { title: 'Dynamic Programming Challenge', difficulty: 'Hard', time: '1 day ago', status: 'in-progress' },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-2xl font-bold gradient-text"
                        >
                            Codility Tracker
                        </motion.h1>
                        <div className="flex items-center gap-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-3 px-4 py-2 glass rounded-full"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                                    {user?.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-white/90 hidden sm:block">
                                    {user?.username}
                                </span>
                            </motion.div>
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 text-white/80 hover:text-white transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Welcome back, <span className="gradient-text">{user?.username}</span>! 👋
                    </h2>
                    <p className="text-white/60">
                        Here's your coding progress overview
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="glass rounded-2xl p-6 card-hover relative overflow-hidden group"
                        >
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} glow`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm text-emerald-400 font-medium">
                                        {stat.change}
                                    </span>
                                </div>
                                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="text-sm text-white/60">{stat.label}</p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 glass rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Code2 className="w-6 h-6 text-purple-400" />
                                Recent Activity
                            </h3>
                            <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                                View All
                            </button>
                        </div>

                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/5 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${activity.status === 'completed' ? 'bg-emerald-400' : 'bg-orange-400'
                                            }`} />
                                        <div>
                                            <p className="font-medium text-white group-hover:text-purple-300 transition-colors">
                                                {activity.title}
                                            </p>
                                            <p className="text-sm text-white/50">{activity.time}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${activity.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                                            activity.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-red-500/20 text-red-400'
                                        }`}>
                                        {activity.difficulty}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        {/* Today's Challenge */}
                        <div className="glass rounded-2xl p-6 gradient-border">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="w-5 h-5 text-purple-400" />
                                <h3 className="text-lg font-bold text-white">Today's Challenge</h3>
                            </div>
                            <p className="text-white/70 mb-4 text-sm">
                                Complete today's daily challenge to maintain your streak!
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all glow"
                            >
                                Start Challenge
                            </motion.button>
                        </div>

                        {/* Progress Card */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Weekly Progress</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-white/70">Problems Solved</span>
                                        <span className="text-white font-medium">12/20</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '60%' }}
                                            transition={{ duration: 1, delay: 0.6 }}
                                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-white/70">Study Time</span>
                                        <span className="text-white font-medium">8.5/10 hrs</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '85%' }}
                                            transition={{ duration: 1, delay: 0.8 }}
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
