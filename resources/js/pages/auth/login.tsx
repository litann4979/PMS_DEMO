import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Fuel, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Log in - PMS" />
            
            <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200 dark:bg-amber-900/20 rounded-full blur-3xl opacity-30 animate-pulse" />
                    <div className="absolute bottom-0 -left-40 w-80 h-80 bg-orange-200 dark:bg-orange-900/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />
                </div>

                {/* Main Container */}
                <div className="relative w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="grid lg:grid-cols-2 min-h-[600px]">
                        {/* Left Column - Branding & Features */}
                        <div className="relative bg-gradient-to-br from-amber-600 to-amber-500 dark:from-amber-700 dark:to-amber-600 p-6 sm:p-8 lg:p-12 text-white overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
                            
                            {/* Floating Elements */}
                            <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            
                            <div className="relative z-10 h-full flex flex-col">
                                {/* Logo */}
                                <div className="flex items-center gap-2 mb-8 sm:mb-12">
                                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                        <Fuel className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <span className="text-xl sm:text-2xl font-bold">PMS</span>
                                </div>

                                {/* Welcome Text */}
                                <div className="flex-1 flex flex-col justify-center">
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                                        Welcome Back! 👋
                                    </h1>
                                    <p className="text-sm sm:text-base text-amber-100 mb-6 sm:mb-8 max-w-md">
                                        Access your fuel station management dashboard to track sales, manage inventory, and monitor performance in real-time.
                                    </p>

                                    {/* Features List */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-white/20 rounded-lg">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-sm">Real-time sales tracking</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-white/20 rounded-lg">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-sm">Inventory management</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-white/20 rounded-lg">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-sm">Customer & vehicle registry</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-white/20 rounded-lg">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-sm">Analytics & reports</span>
                                        </div>
                                    </div>

                                    {/* Testimonial */}
                                    <div className="mt-8 sm:mt-12 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                                        <p className="text-xs sm:text-sm italic mb-2">
                                            "PMS has transformed how we manage our fuel station. The insights are invaluable."
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                                                R
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold">Rajesh Kumar</p>
                                                <p className="text-xs text-amber-200">Fuel Station Owner</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Login Form */}
                        <div className="p-6 sm:p-8 lg:p-12 flex items-center">
                            <div className="w-full max-w-md mx-auto">
                                {/* Mobile Logo (visible only on mobile) */}
                                <div className="flex items-center gap-2 mb-6 lg:hidden">
                                    <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
                                        <Fuel className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                                        PMS
                                    </span>
                                </div>

                                {/* Form Header */}
                                <div className="mb-6 sm:mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        Sign in to your account
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                        Enter your credentials to access the dashboard
                                    </p>
                                </div>

                                {/* Status Message */}
                                {status && (
                                    <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                        <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                            {status}
                                        </p>
                                    </div>
                                )}

                                <Form
                                    {...store.form()}
                                    resetOnSuccess={['password']}
                                    className="flex flex-col gap-6"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-5">
                                                {/* Email Field */}
                                                <div className="grid gap-2">
                                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Email address
                                                    </Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            name="email"
                                                            required
                                                            autoFocus
                                                            tabIndex={1}
                                                            autoComplete="email"
                                                            placeholder="email@example.com"
                                                            className="pl-10 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20 h-11"
                                                        />
                                                    </div>
                                                    <InputError message={errors.email} />
                                                </div>

                                                {/* Password Field */}
                                                <div className="grid gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Password
                                                        </Label>
                                                        {canResetPassword && (
                                                            <TextLink
                                                                href={request()}
                                                                className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
                                                                tabIndex={5}
                                                            >
                                                                Forgot password?
                                                            </TextLink>
                                                        )}
                                                    </div>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <Input
                                                            id="password"
                                                            type={showPassword ? "text" : "password"}
                                                            name="password"
                                                            required
                                                            tabIndex={2}
                                                            autoComplete="current-password"
                                                            placeholder="Enter your password"
                                                            className="pl-10 pr-10 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20 h-11"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                            tabIndex={-1}
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="w-4 h-4" />
                                                            ) : (
                                                                <Eye className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <InputError message={errors.password} />
                                                </div>

                                                {/* Remember Me Checkbox */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <Checkbox
                                                            id="remember"
                                                            name="remember"
                                                            tabIndex={3}
                                                            className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                                                        />
                                                        <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">
                                                            Remember me
                                                        </Label>
                                                    </div>
                                                </div>

                                                {/* Submit Button */}
                                                <Button
                                                    type="submit"
                                                    className="w-full h-11 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    tabIndex={4}
                                                    disabled={processing}
                                                    data-test="login-button"
                                                >
                                                    {processing ? (
                                                        <div className="flex items-center gap-2">
                                                            <Spinner />
                                                            <span>Signing in...</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span>Sign in</span>
                                                            <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </Button>
                                            </div>

                                        </>
                                    )}
                                </Form>

                                {/* Security Note */}
                                <div className="mt-6 text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        Protected by enterprise-grade security
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}