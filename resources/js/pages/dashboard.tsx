import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState, useEffect } from 'react';
import {
    TrendingUp,
    ShoppingCart,
    Clock,
    Fuel,
    Wallet,
    Activity,
    Users,
    AlertTriangle,
    BarChart3,
    ArrowUpCircle,
    ArrowDownCircle,
    Building2,
    Calendar,
    ChevronRight,
    DollarSign,
    Percent,
    CreditCard,
    Landmark,
    ShieldCheck,
    Zap,
    Droplets,
    Gauge,
    MousePointer2,
    Package,
    Box,
    Sparkles,
    Layers,
    PieChart,
    Target,
    Award,
    Flame,
    TrendingDown,
    ArrowRight,
    RefreshCw
} from 'lucide-react';

interface Props {
    period: string;
    executive_kpi: any;
    bank_position: any;
    outstanding: any;
    shift_performance: any;
    fuel_performance: any[];
    stock_levels: any[];
    payment_mode_split: any[];
    sales_trend_30_days: any[];
    recent_sales: any[];
    recent_purchases: any[];
    recent_products: any[];
}

export default function Dashboard({
    period,
    executive_kpi,
    bank_position,
    outstanding,
    shift_performance,
    fuel_performance,
    stock_levels,
    payment_mode_split,
    sales_trend_30_days,
    recent_sales,
    recent_purchases,
    recent_products,
}: Props) {
    const [selectedPeriod, setSelectedPeriod] = useState(period || 'today');
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const handlePeriodChange = (newPeriod: string) => {
        setSelectedPeriod(newPeriod);
        router.get(route('admin.dashboard'), { period: newPeriod }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value || 0);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('en-IN').format(value || 0);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const kpis = [
        {
            label: "Today's Revenue",
            value: executive_kpi.today_revenue,
            sub: `${executive_kpi.today_bills || 0} Transactions`,
            icon: ShoppingCart,
            gradient: 'from-blue-600 to-blue-400',
            lightBg: 'bg-blue-50',
            darkBg: 'dark:bg-blue-900/20',
            iconColor: 'text-blue-600 dark:text-blue-400',
            chart: '📈',
        },
        {
            label: "Today's Profit",
            value: executive_kpi.today_profit,
            sub: "Net Earnings",
            icon: TrendingUp,
            gradient: 'from-emerald-600 to-emerald-400',
            lightBg: 'bg-emerald-50',
            darkBg: 'dark:bg-emerald-900/20',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            chart: '💰',
        },
        {
            label: "Cash in Hand",
            value: bank_position.cash_in_hand,
            sub: "Physical Cash",
            icon: Wallet,
            gradient: 'from-amber-600 to-amber-400',
            lightBg: 'bg-amber-50',
            darkBg: 'dark:bg-amber-900/20',
            iconColor: 'text-amber-600 dark:text-amber-400',
            chart: '💵',
        },
        {
            label: "Bank Balance",
            value: bank_position.bank_balance,
            sub: "All Accounts",
            icon: Landmark,
            gradient: 'from-purple-600 to-purple-400',
            lightBg: 'bg-purple-50',
            darkBg: 'dark:bg-purple-900/20',
            iconColor: 'text-purple-600 dark:text-purple-400',
            chart: '🏦',
        },
    ];

    return (
        <AppLayout>
            <Head title="Executive Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pb-8 lg:pb-12">
                {/* Animated Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200 dark:bg-amber-900/20 rounded-full blur-3xl opacity-20 animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
                </div>

                {/* Mobile Header - Sticky */}
                <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 lg:hidden">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg blur opacity-60 animate-pulse" />
                                <div className="relative p-2 bg-white dark:bg-gray-800 rounded-lg">
                                    <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {greeting}, Admin
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date().toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePeriodChange(selectedPeriod)}
                                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <Link
                                href={route('admin.shifts.index')}
                                className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg shadow-lg shadow-amber-500/30"
                            >
                                <Clock className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Period Selector with Animation */}
                    <div className="flex gap-2 px-4 pb-4">
                        {[
                            { value: 'today', label: 'Today', icon: Clock },
                            { value: 'week', label: 'This Week', icon: Calendar },
                            { value: 'month', label: 'This Month', icon: BarChart3 },
                        ].map((p) => (
                            <button
                                key={p.value}
                                onClick={() => handlePeriodChange(p.value)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${selectedPeriod === p.value
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 scale-105'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105'
                                    }`}
                            >
                                <p.icon className="w-3.5 h-3.5" />
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desktop Header with Glassmorphism */}
                <div className="hidden lg:block p-4 md:p-8 max-w-[1600px] mx-auto">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-amber-600/10 dark:from-amber-500/5 dark:to-amber-600/5 rounded-3xl blur-xl" />
                        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl blur-xl opacity-60 animate-pulse" />
                                        <div className="relative p-3 bg-white dark:bg-gray-800 rounded-xl">
                                            <Activity className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                                Executive Dashboard
                                            </h1>
                                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                LIVE
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                            <span>{greeting}! Here's your business overview</span>
                                            <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                            <span>Last updated: {new Date().toLocaleTimeString()}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <select
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                                        value={selectedPeriod}
                                        onChange={(e) => handlePeriodChange(e.target.value)}
                                    >
                                        <option value="today">📅 Today</option>
                                        <option value="week">📊 This Week</option>
                                        <option value="month">📈 This Month</option>
                                    </select>
                                    <Link
                                        href={route('admin.shifts.index')}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
                                    >
                                        <Clock className="w-4 h-4" />
                                        Manage Shifts
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-4 lg:space-y-8">
                    {/* KPI Cards - Mobile Horizontal Scroll with Animation */}
                    <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
                        <div className="flex gap-3 min-w-max pb-2">
                            {kpis.map((kpi, i) => (
                                <div
                                    key={i}
                                    className="relative w-72 group animate-in slide-in-from-right duration-500"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`p-3 rounded-xl ${kpi.lightBg} ${kpi.darkBg} group-hover:scale-110 transition-transform`}>
                                                <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-lg">{kpi.chart}</span>
                                                <span className="text-[8px] font-bold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800">
                                                    +{Math.floor(Math.random() * 10)}%
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">{kpi.label}</p>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                                            {formatCurrency(kpi.value)}
                                        </p>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <p className="text-[10px] text-gray-500">{kpi.sub}</p>
                                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop KPI Grid with 3D Effect */}
                    <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {kpis.map((kpi, i) => (
                            <div
                                key={i}
                                className="group relative animate-in fade-in slide-in-from-bottom-4 duration-700"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all hover:-translate-y-2">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl ${kpi.lightBg} ${kpi.darkBg} group-hover:scale-110 transition-transform duration-300`}>
                                            <kpi.icon className={`w-6 h-6 ${kpi.iconColor}`} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{kpi.chart}</span>
                                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                                                +{Math.floor(Math.random() * 15)}%
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400 font-bold tracking-wider mb-1">
                                        {kpi.label}
                                    </p>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                                        {formatCurrency(kpi.value)}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <Activity className="w-3 h-3" />
                                            {kpi.sub}
                                        </p>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Financial Overview Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                        {/* Outstanding Cards with Gradient */}
                        <div className="lg:col-span-1">
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                                {/* Customer Outstanding */}
                                <div className="group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl" />
                                    <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 -translate-y-16" />
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl">
                                                <Users className="w-6 h-6 text-white" />
                                            </div>
                                            <ArrowDownCircle className="w-8 h-8 text-white/50" />
                                        </div>
                                        <p className="text-xs text-white/80 uppercase font-bold tracking-wider mb-1">
                                            Customer Outstanding
                                        </p>
                                        <h4 className="text-3xl font-black text-white mb-2">
                                            {formatCurrency(outstanding.customer || 0)}
                                        </h4>
                                        <div className="flex items-center gap-2 text-white/80 text-xs">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>To be collected</span>
                                        </div>
                                        <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
                                            <div className="w-3/4 h-full bg-white rounded-full" />
                                        </div>
                                    </div>
                                </div>

                                {/* Supplier Payable */}
                                <div className="group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl" />
                                    <div className="relative bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 -translate-y-16" />
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl">
                                                <Building2 className="w-6 h-6 text-white" />
                                            </div>
                                            <ArrowUpCircle className="w-8 h-8 text-white/50" />
                                        </div>
                                        <p className="text-xs text-white/80 uppercase font-bold tracking-wider mb-1">
                                            Supplier Payable
                                        </p>
                                        <h4 className="text-3xl font-black text-white mb-2">
                                            {formatCurrency(outstanding.party || 0)}
                                        </h4>
                                        <div className="flex items-center gap-2 text-white/80 text-xs">
                                            <TrendingUp className="w-3 h-3 rotate-180" />
                                            <span>Due to suppliers</span>
                                        </div>
                                        <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
                                            <div className="w-2/3 h-full bg-white rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shift Performance with Avatar */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg blur opacity-60 animate-pulse" />
                                    <div className="relative p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg text-white">
                                        <Users className="w-5 h-5" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Shift Performance</h3>
                                <span className="ml-auto px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold">
                                    TODAY
                                </span>
                            </div>

                            <div className="space-y-6">
                                <div className="relative p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8" />
                                    <div className="relative">
                                        <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mb-1">AVERAGE SALE PER SHIFT</p>
                                        <p className="text-3xl font-black text-amber-700 dark:text-amber-300">
                                            {formatCurrency(shift_performance.avg_sale || 0)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                            <p className="text-[10px] text-amber-600 dark:text-amber-400">vs last period +12%</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                                        <Award className="w-3.5 h-3.5 text-amber-500" />
                                        TOP PERFORMER
                                    </p>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full blur opacity-60 animate-pulse" />
                                            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                                                {shift_performance.top_sales_person?.sales_person?.name?.charAt(0) || 'N'}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 dark:text-white text-lg">
                                                {shift_performance.top_sales_person?.sales_person?.name || 'No data'}
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Flame className="w-3 h-3 text-amber-500" />
                                                Today's Top Sales • {formatCurrency(shift_performance.top_sales_person?.total || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Mode Split with Charts */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
                                    <PieChart className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Payment Split</h3>
                            </div>

                            <div className="space-y-5">
                                {payment_mode_split.length > 0 ? (
                                    payment_mode_split.map((mode, i) => {
                                        const total = payment_mode_split.reduce((acc, m) => acc + Number(m.total), 0);
                                        const percentage = (mode.total / total) * 100;
                                        return (
                                            <div key={i} className="group">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${mode.payment_type === 'CASH' ? 'bg-emerald-500' :
                                                            mode.payment_type === 'CARD' ? 'bg-blue-500' :
                                                                mode.payment_type === 'UPI' ? 'bg-purple-500' : 'bg-amber-500'
                                                            }`} />
                                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                            {mode.payment_type}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-black text-purple-600 dark:text-purple-400">
                                                            {formatCurrency(mode.total)}
                                                        </span>
                                                        <span className="text-xs text-gray-500 w-12 text-right">
                                                            {percentage.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`absolute inset-0 bg-gradient-to-r ${mode.payment_type === 'CASH' ? 'from-emerald-500 to-emerald-400' :
                                                            mode.payment_type === 'CARD' ? 'from-blue-500 to-blue-400' :
                                                                mode.payment_type === 'UPI' ? 'from-purple-500 to-purple-400' : 'from-amber-500 to-amber-400'
                                                            } rounded-full transition-all duration-500 group-hover:scale-105`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                        No payment data for today
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Total Collection</span>
                                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(bank_position.today_cash_collection || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Performance with Bars */}
                    {/* <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
                                    <Fuel className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Fuel Product Performance</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold">
                                    TOP SELLERS
                                </span>
                                <BarChart3 className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fuel_performance.length > 0 ? (
                                fuel_performance.map((item, i) => {
                                    const maxRevenue = Math.max(...fuel_performance.map(f => f.revenue));
                                    const percentage = (item.revenue / maxRevenue) * 100;
                                    const isPetrol = item.name.toLowerCase().includes('petrol');
                                    return (
                                        <div key={i} className="group p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-all">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${isPetrol ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                                                        <Droplets className={`w-4 h-4 ${isPetrol ? 'text-amber-600' : 'text-blue-600'}`} />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-800 dark:text-white">
                                                            {item.name}
                                                        </span>
                                                        <p className="text-xs text-gray-500">{item.liters} Liters</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-black text-lg text-blue-600 dark:text-blue-400">
                                                        {formatCurrency(item.revenue)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`absolute inset-0 bg-gradient-to-r ${isPetrol ? 'from-amber-500 to-amber-400' : 'from-blue-500 to-blue-400'
                                                        } rounded-full transition-all duration-500 group-hover:scale-105`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-2 text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                    No product performance data available
                                </div>
                            )}
                        </div>
                    </div> */}

                    {/* Stock Levels with Visual Indicators */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg text-white">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Inventory Status</h3>
                            <span className="ml-auto px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full text-[10px] font-bold">
                                {stock_levels.filter((p: any) => {
                                    const totalAdded = Number(p.total_added) || 0;
                                    const totalSold = Number(p.total_sold) || 0;
                                    const soldPct = totalAdded > 0 ? (totalSold / totalAdded) * 100 : 0;
                                    return soldPct >= 80;
                                }).length} CRITICAL
                            </span>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {stock_levels.slice(0, 8).map((product: any) => {
                                const totalAdded = Number(product.total_added) || 0;
                                const totalSold = Number(product.total_sold) || 0;
                                const remainingStock = Number(product.remaining_stock) || 0;
                                const soldPercent = totalAdded > 0 ? (totalSold / totalAdded) * 100 : 0;
                                const isCritical = soldPercent >= 80;
                                const isModerate = soldPercent >= 50;

                                return (
                                    <div
                                        key={product.id}
                                        className="group relative p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-rose-500 dark:hover:border-rose-500 transition-all hover:shadow-lg"
                                    >
                                        <div className="absolute top-2 right-2">
                                            {isCritical ? (
                                                <span className="px-2 py-1 bg-rose-500 text-white rounded-full text-[8px] font-bold animate-pulse">
                                                    CRITICAL
                                                </span>
                                            ) : isModerate ? (
                                                <span className="px-2 py-1 bg-amber-500 text-white rounded-full text-[8px] font-bold">
                                                    MODERATE
                                                </span>
                                            ) : null}
                                        </div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 pr-16 truncate">
                                            {product.name}
                                        </p>
                                        <div className="flex items-baseline justify-between mb-1">
                                            <h4 className={`text-2xl font-black ${isCritical ? 'text-rose-600' : isModerate ? 'text-amber-600' : 'text-emerald-600'
                                                }`}>
                                                {remainingStock}
                                            </h4>
                                            <span className="text-xs text-gray-500">remaining</span>
                                        </div>
                                        <p className={`text-[10px] font-semibold mb-2 ${isCritical ? 'text-rose-500' : isModerate ? 'text-amber-500' : 'text-emerald-500'}`}>
                                            Sold {totalSold} / {totalAdded}
                                        </p>
                                        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`absolute inset-0 rounded-full transition-all duration-500 group-hover:scale-105 ${isCritical ? 'bg-gradient-to-r from-rose-500 to-rose-400' :
                                                    isModerate ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                                                        'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                                    }`}
                                                style={{ width: `${Math.min(soldPercent, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {stock_levels.length === 0 && (
                            <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                No stock data available
                            </div>
                        )}

                        {stock_levels.length > 8 && (
                            <div className="mt-4 text-center">
                                <Link
                                    href={route('admin.products.index')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-all"
                                >
                                    View All Products
                                    <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Recent Activities Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                        {/* Recent Sales */}
                        <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                                        <ShoppingCart className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Recent Sales</h3>
                                </div>
                                <Link
                                    href={route('admin.sales.index')}
                                    className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg"
                                >
                                    View All
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {recent_sales && recent_sales.length > 0 ? (
                                    recent_sales.map((sale: any, index: number) => (
                                        <div
                                            key={sale.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-all hover:scale-[1.02] animate-in fade-in slide-in-from-left duration-300"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                    {sale.customer?.name?.charAt(0) || 'W'}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                        {sale.customer?.name || 'Walk-in Customer'}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                        <span>{sale.invoice_number}</span>
                                                        <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                                        <span>{formatDate(sale.sale_date)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0 ml-2">
                                                <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                                                    {formatCurrency(sale.total_amount)}
                                                </p>
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${sale.status === 'PAID'
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                                                    : sale.status === 'PARTIALLY_PAID'
                                                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 border border-amber-200 dark:border-amber-800'
                                                        : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 border border-rose-200 dark:border-rose-800'
                                                    }`}>
                                                    {sale.status?.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                        <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                        <p>No recent sales</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Purchases */}
                        <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Recent Purchases</h3>
                                </div>
                                <Link
                                    href={route('admin.purchases.index')}
                                    className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg"
                                >
                                    View All
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {recent_purchases && recent_purchases.length > 0 ? (
                                    recent_purchases.map((purchase: any, index: number) => (
                                        <div
                                            key={purchase.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-all hover:scale-[1.02] animate-in fade-in slide-in-from-left duration-300"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                    {purchase.party?.name?.charAt(0) || 'S'}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                        {purchase.party?.name || 'Unknown Supplier'}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                        <span>{purchase.bill_number || 'No Bill'}</span>
                                                        <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                                        <span>{formatDate(purchase.purchase_date)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0 ml-2">
                                                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                                                    {formatCurrency(purchase.total_amount)}
                                                </p>
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${purchase.balance_amount == 0
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                                                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 border border-amber-200 dark:border-amber-800'
                                                    }`}>
                                                    {purchase.balance_amount == 0 ? 'PAID' : `DUE ₹${purchase.balance_amount}`}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                        <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                        <p>No recent purchases</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Products */}
                        <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                                        <Box className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Recent Products</h3>
                                </div>
                                <Link
                                    href={route('admin.products.index')}
                                    className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-lg"
                                >
                                    View All
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {recent_products && recent_products.length > 0 ? (
                                    recent_products.map((product: any, index: number) => (
                                        <div
                                            key={product.id}
                                            className="group/item p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gradient-to-br hover:from-amber-500 hover:to-amber-600 transition-all hover:scale-[1.02] animate-in fade-in duration-300"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg mb-2 group-hover/item:scale-110 transition-transform">
                                                    {product.name?.charAt(0) || 'P'}
                                                </div>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white group-hover/item:text-white truncate w-full">
                                                    {product.name}
                                                </p>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 group-hover/item:text-white/80 mt-1">
                                                    {product.unit || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                        <Box className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                        <p>No recent products</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 20px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4a5568;
                }
            `}</style>
        </AppLayout>
    );
}