import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import type { SharedData } from '@/types';
import { 
    Fuel, Droplets, Truck, Users, ShoppingCart, 
    Gauge, ShieldCheck, ArrowRight, Star, Clock,
    TrendingUp, DollarSign, BarChart3, Zap
} from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome - PMS">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700|inter:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            
            <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200 dark:bg-amber-900/20 rounded-full blur-3xl opacity-30 animate-pulse" />
                    <div className="absolute top-60 -left-40 w-80 h-80 bg-orange-200 dark:bg-orange-900/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />
                    <div className="absolute bottom-0 right-20 w-60 h-60 bg-amber-100 dark:bg-amber-900/10 rounded-full blur-3xl opacity-40 animate-pulse delay-700" />
                </div>

                {/* Navigation Bar */}
                <nav className="relative z-10 border-b border-amber-100/50 dark:border-amber-900/20 backdrop-blur-sm bg-white/70 dark:bg-gray-900/70">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16 sm:h-20">
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/25">
                                    <Fuel className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                    PMS
                                </span>
                            </div>

                            {/* Auth Buttons */}
                            <div className="flex items-center gap-3 sm:gap-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="group relative px-5 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Dashboard
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                ) : (
                                    <>
                                      
                                 
                                            <Link
                                                href={login()}
                                                className="px-4 sm:px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                                            >
                                                Log in
                                            </Link>
                                        
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        {/* Left Column - Content */}
                        <div className="space-y-6 sm:space-y-8">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full border border-amber-200 dark:border-amber-800">
                                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                <span className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300">
                                    Complete Fuel Station Management Solution
                                </span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                    Petrol Management
                                </span>
                                <br />
                                <span className="text-gray-900 dark:text-white">
                                    System
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl">
                                Streamline your fuel station operations with our comprehensive management solution. Track sales, manage inventory, handle customers, and monitor performance in real-time.
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 pt-4">
                                <div className="space-y-1">
                                    <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">500+</p>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Active Stations</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">10k+</p>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Daily Transactions</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">99.9%</p>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Uptime</p>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                                <Link
                                    href={login()}
                                    className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl text-sm sm:text-base font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    Access dashboard
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="#features"
                                    className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm sm:text-base font-semibold border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 flex items-center justify-center"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>

                        {/* Right Column - Dashboard Preview */}
                        <div className="relative mt-8 lg:mt-0">
                            <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
                                {/* Dashboard Header */}
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-rose-500 rounded-full" />
                                        <div className="w-3 h-3 bg-amber-500 rounded-full" />
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                                        <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">Dashboard Preview</span>
                                    </div>
                                </div>

                                {/* Dashboard Content */}
                                <div className="p-4 sm:p-6 space-y-4">
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl">
                                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 mb-2" />
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Sales</p>
                                            <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">₹45.2k</p>
                                        </div>
                                        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
                                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mb-2" />
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Customers</p>
                                            <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">128</p>
                                        </div>
                                        <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl">
                                            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Vehicles</p>
                                            <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">342</p>
                                        </div>
                                    </div>

                                    {/* Chart Preview */}
                                    <div className="h-24 sm:h-32 bg-gradient-to-r from-amber-100/50 to-orange-100/50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-3 flex items-end gap-1">
                                        <div className="w-8 bg-amber-400 dark:bg-amber-600 h-12 rounded-t-lg" />
                                        <div className="w-8 bg-amber-500 dark:bg-amber-500 h-16 rounded-t-lg" />
                                        <div className="w-8 bg-amber-600 dark:bg-amber-400 h-20 rounded-t-lg" />
                                        <div className="w-8 bg-amber-500 dark:bg-amber-500 h-14 rounded-t-lg" />
                                        <div className="w-8 bg-amber-400 dark:bg-amber-600 h-10 rounded-t-lg" />
                                    </div>

                                    {/* Activity List */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Fuel className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                                                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Petrol Sale</span>
                                            </div>
                                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+₹1,250</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                                                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Diesel Sale</span>
                                            </div>
                                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+₹2,480</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
                            <div className="absolute -top-4 -left-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
                        </div>
                    </div>

                    {/* Features Section */}
                    <div id="features" className="mt-16 sm:mt-24 lg:mt-32">
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Everything you need to manage your
                                <span className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent"> fuel station</span>
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Comprehensive tools to streamline operations, boost efficiency, and grow your business.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {/* Feature 1 */}
                            <div className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl">
                                <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Sales Management</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Track fuel sales, generate invoices, and manage transactions in real-time.</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl">
                                <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                                    <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Purchase Tracking</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Manage fuel procurement, track suppliers, and monitor inventory levels.</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl">
                                <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Customer Registry</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Maintain customer database with vehicle details and purchase history.</p>
                            </div>

                            {/* Feature 4 */}
                            <div className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl">
                                <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                                    <Gauge className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Vehicle Management</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Track vehicles, fuel efficiency, and service history for fleet customers.</p>
                            </div>

                            {/* Feature 5 */}
                            <div className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl">
                                <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Analytics & Reports</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Get insights with detailed reports on sales, profits, and performance.</p>
                            </div>

                            {/* Feature 6 */}
                            <div className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl">
                                <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Secure & Reliable</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Enterprise-grade security with role-based access and data protection.</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-16 sm:mt-24 lg:mt-32 bg-gradient-to-br from-amber-600 to-amber-500 dark:from-amber-700 dark:to-amber-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
                        <div className="relative z-10">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                                Ready to transform your fuel station?
                            </h2>
                            <p className="text-sm sm:text-base text-amber-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
                                Join thousands of fuel station owners who are already using PMS to streamline their operations.
                            </p>
                            <Link
                                href={login()}
                                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-amber-600 rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                            >
                                Log in
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="mt-16 sm:mt-24 pt-8 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                                    <Fuel className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">PMS</span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                © 2024 Petrol Management System. All rights reserved.
                            </p>
                            <div className="flex items-center gap-4">
                                <Link href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                    Privacy
                                </Link>
                                <Link href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                    Terms
                                </Link>
                                <Link href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                                    Contact
                                </Link>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}