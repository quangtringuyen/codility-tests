import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '../stores/authStore'
import { LogIn, Sparkles, Shield, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginForm) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            login(
                { id: 1, username: data.username, isAdmin: true },
                'mock-token'
            )

            toast.success('Welcome back! 🎉', {
                description: 'Successfully logged in to your account',
            })
            navigate('/')
        } catch (error) {
            toast.error('Login failed', {
                description: 'Invalid credentials. Please try again.',
            })
        }
    }

    const features = [
        { icon: Sparkles, text: 'Track Progress', color: 'from-purple-500 to-pink-500' },
        { icon: Shield, text: 'Secure & Private', color: 'from-blue-500 to-cyan-500' },
        { icon: Zap, text: 'Lightning Fast', color: 'from-emerald-500 to-teal-500' },
    ]

    return (
        <div className="min-h-screen relative overflow-hidden animated-gradient">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl float" style={{ animationDelay: '4s' }} />
            </div>

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center"
                >
                    {/* Left Side - Branding */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden lg:block space-y-8"
                    >
                        <div className="space-y-4">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="inline-block"
                            >
                                <h1 className="text-6xl font-bold gradient-text">
                                    Codility Tracker
                                </h1>
                            </motion.div>
                            <p className="text-xl text-white/80 font-light">
                                Master your coding journey with intelligent progress tracking
                            </p>
                        </div>

                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                    className="flex items-center gap-4 glass rounded-2xl p-4 card-hover"
                                >
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} glow`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-white font-medium">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side - Login Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full"
                    >
                        <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl glow">
                            {/* Mobile Logo */}
                            <div className="lg:hidden mb-8 text-center">
                                <h1 className="text-4xl font-bold gradient-text mb-2">
                                    Codility Tracker
                                </h1>
                                <p className="text-white/70">Sign in to continue</p>
                            </div>

                            <div className="hidden lg:block mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    Welcome Back
                                </h2>
                                <p className="text-white/70">
                                    Enter your credentials to access your dashboard
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Username Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-medium text-white/90"
                                    >
                                        Username
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register('username')}
                                            type="text"
                                            id="username"
                                            className="w-full px-4 py-4 rounded-xl glass text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all shimmer"
                                            placeholder="Enter your username"
                                            autoComplete="username"
                                        />
                                    </div>
                                    {errors.username && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm text-red-400 flex items-center gap-1"
                                        >
                                            {errors.username.message}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-white/90"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register('password')}
                                            type="password"
                                            id="password"
                                            className="w-full px-4 py-4 rounded-xl glass text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all shimmer"
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                        />
                                    </div>
                                    {errors.password && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm text-red-400 flex items-center gap-1"
                                        >
                                            {errors.password.message}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 hover:from-purple-700 hover:via-blue-700 hover:to-emerald-700 text-white font-semibold shadow-lg glow transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-5 h-5" />
                                                Sign In
                                            </>
                                        )}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                                </motion.button>

                                {/* Additional Links */}
                                <div className="text-center pt-4">
                                    <button
                                        type="button"
                                        className="text-sm text-white/60 hover:text-white transition-colors"
                                    >
                                        Forgot your password?
                                    </button>
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                <p className="text-sm text-white/50">
                                    Powered by modern web technologies
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
