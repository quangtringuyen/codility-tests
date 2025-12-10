import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '../stores/authStore'
import { LogIn } from 'lucide-react'

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
            // TODO: Replace with actual API call
            // const response = await api.post('/auth/login', data)

            // Mock login for now
            await new Promise((resolve) => setTimeout(resolve, 1000))

            login(
                { id: 1, username: data.username, isAdmin: true },
                'mock-token'
            )

            toast.success('Login successful!')
            navigate('/')
        } catch (error) {
            toast.error('Invalid credentials')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Codility Tracker
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            Sign in to your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                            >
                                Username
                            </label>
                            <input
                                {...register('username')}
                                type="text"
                                id="username"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                            >
                                Password
                            </label>
                            <input
                                {...register('password')}
                                type="password"
                                id="password"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
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
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
