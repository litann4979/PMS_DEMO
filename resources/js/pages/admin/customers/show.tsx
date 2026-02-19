import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    Edit, Car, Phone, Mail, MapPin, ArrowLeft, History, Plus,
    Building2, User, CreditCard, Calendar, Package, ChevronRight,
    AlertCircle, CheckCircle2, XCircle, MoreVertical, Download,
    Printer, Share2, Star, Truck, FileText, DollarSign
} from 'lucide-react';

export default function ShowCustomer({ customer, stats }: any) {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'vehicles' | 'transactions'>('details');

    // Mock transaction data - replace with actual data from props
    const recentTransactions = [
        { id: 1, date: '2024-02-15', amount: 1500, type: 'purchase', status: 'completed' },
        { id: 2, date: '2024-02-10', amount: 3200, type: 'payment', status: 'completed' },
        { id: 3, date: '2024-02-05', amount: 800, type: 'purchase', status: 'pending' },
    ];

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout>
            <Head title={`Customer: ${customer.name}`} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8 lg:pb-12">
                {/* Mobile Header - Sticky */}
                <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
                    <div className="flex items-center justify-between p-4">
                        <Link
                            href={route('admin.customers.index')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </Link>
                        <h1 className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
                            {customer.name}
                        </h1>
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>

                    {/* Mobile Action Menu */}
                    {showMobileMenu && (
                        <div className="absolute right-4 top-16 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 w-48 z-30">
                            <Link
                                href={route('admin.customers.edit', customer.id)}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-gray-700 dark:text-gray-200 transition-colors"
                            >
                                <Edit className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-medium">Edit Profile</span>
                            </Link>
                            <Link
                                href={route('admin.vehicles.create', { customer_id: customer.id })}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-gray-700 dark:text-gray-200 transition-colors"
                            >
                                <Plus className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm font-medium">Add Vehicle</span>
                            </Link>
                            <button
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-gray-700 dark:text-gray-200 transition-colors"
                                onClick={() => window.print()}
                            >
                                <Printer className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium">Print Profile</span>
                            </button>
                        </div>
                    )}

                    {/* Mobile Tabs */}
                    <div className="flex gap-1 px-4 pb-3">
                        {[
                            { id: 'details', label: 'Details', icon: User },
                            { id: 'vehicles', label: 'Vehicles', icon: Car },
                            { id: 'transactions', label: 'Activity', icon: History },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desktop Header */}
                <div className="hidden lg:block p-4 md:p-8 max-w-[1600px] mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('admin.customers.index')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{customer.name}</h1>
                                    {customer.is_active !== false && (
                                        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                            ACTIVE
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {customer.company_name || 'Individual Customer'} • Customer ID: #{String(customer.id).padStart(5, '0')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('admin.vehicles.create', { customer_id: customer.id })}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Vehicle
                            </Link>
                            <Link
                                href={route('admin.customers.edit', customer.id)}
                                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
                    {/* Desktop Stats Cards - Hidden on Mobile */}
                    <div className="hidden lg:grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest mb-1">Total Vehicles</p>
                                    <h2 className="text-3xl font-black text-amber-800 dark:text-amber-200">{customer.vehicles?.length || 0}</h2>
                                </div>
                                <Car className="w-8 h-8 text-amber-500/30" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest mb-1">Total Purchases</p>
                                    <h2 className="text-3xl font-black text-blue-800 dark:text-blue-200">₹{(stats?.total_purchases || 0).toLocaleString()}</h2>
                                </div>
                                <Package className="w-8 h-8 text-blue-500/30" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest mb-1">Outstanding</p>
                                    <h2 className="text-3xl font-black text-emerald-800 dark:text-emerald-200">₹{(stats?.outstanding || 0).toLocaleString()}</h2>
                                </div>
                                <DollarSign className="w-8 h-8 text-emerald-500/30" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/30 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest mb-1">Member Since</p>
                                    <h2 className="text-xl font-black text-purple-800 dark:text-purple-200">
                                        {new Date(customer.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                                    </h2>
                                </div>
                                <Calendar className="w-8 h-8 text-purple-500/30" />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Stats Cards - 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-3 lg:hidden mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <Car className="w-5 h-5 text-amber-500 mb-2" />
                            <p className="text-xs text-gray-500">Vehicles</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{customer.vehicles?.length || 0}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <Package className="w-5 h-5 text-blue-500 mb-2" />
                            <p className="text-xs text-gray-500">Purchases</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">₹{(stats?.total_purchases || 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <DollarSign className="w-5 h-5 text-emerald-500 mb-2" />
                            <p className="text-xs text-gray-500">Outstanding</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">₹{(stats?.outstanding || 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <Calendar className="w-5 h-5 text-purple-500 mb-2" />
                            <p className="text-xs text-gray-500">Since</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {new Date(customer.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                            </p>
                        </div>
                    </div>

                    {/* Desktop Layout - 3 Column Grid */}
                    <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Contact Information Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                        <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    Contact Information
                                </h3>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Name</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{customer.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <Phone className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mobile Number</p>
                                        <p className="font-bold text-gray-900 dark:text-white font-mono">{customer.mobile}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <Mail className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{customer.email || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <MapPin className="w-4 h-4 text-rose-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{customer.address || 'No address provided'}</p>
                                    </div>
                                </div>
                                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">GST Number</span>
                                        <span className="font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                                            {customer.gst_number || 'Not Registered'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicles List - 2 Columns */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Car className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    Registered Vehicles ({customer.vehicles?.length || 0})
                                </h3>
                            </div>
                            {customer.vehicles?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                                    {customer.vehicles.map((vehicle: any) => (
                                        <Link
                                            key={vehicle.id}
                                            href={route('admin.vehicles.show', vehicle.id)}
                                            className="group bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 transition-all hover:shadow-md"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                                        <Car className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-lg uppercase tracking-tight text-gray-900 dark:text-white">
                                                            {vehicle.vehicle_number}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{vehicle.vehicle_type}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                                    vehicle.is_active
                                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                                        : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                                                }`}>
                                                    {vehicle.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                <span>Last Service: {vehicle.last_service || 'N/A'}</span>
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                        <Car className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">No Vehicles Found</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This customer hasn't registered any vehicles yet.</p>
                                    <Link
                                        href={route('admin.vehicles.create', { customer_id: customer.id })}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add First Vehicle
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Tab Content */}
                    <div className="lg:hidden space-y-4">
                        {/* Details Tab */}
                        {activeTab === 'details' && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white">Personal Information</h3>
                                </div>
                                <div className="p-4 space-y-4">
                                    <InfoRow icon={User} label="Full Name" value={customer.name} />
                                    <InfoRow icon={Phone} label="Mobile" value={customer.mobile} />
                                    <InfoRow icon={Mail} label="Email" value={customer.email || 'Not provided'} />
                                    <InfoRow icon={MapPin} label="Address" value={customer.address || 'No address provided'} />
                                    <InfoRow icon={CreditCard} label="GST Number" value={customer.gst_number || 'Not Registered'} />
                                </div>
                            </div>
                        )}

                        {/* Vehicles Tab */}
                        {activeTab === 'vehicles' && (
                            <div className="space-y-3">
                                {customer.vehicles?.length > 0 ? (
                                    customer.vehicles.map((vehicle: any) => (
                                        <Link
                                            key={vehicle.id}
                                            href={route('admin.vehicles.show', vehicle.id)}
                                            className="block bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-transform"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                                        <Car className="w-5 h-5 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white uppercase">
                                                            {vehicle.vehicle_number}
                                                        </h4>
                                                        <p className="text-xs text-gray-500">{vehicle.vehicle_type}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                                <span className="text-xs text-gray-500">Status</span>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                    vehicle.is_active
                                                        ? 'bg-emerald-100 text-emerald-600'
                                                        : 'bg-rose-100 text-rose-600'
                                                }`}>
                                                    {vehicle.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
                                        <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No vehicles found</p>
                                        <Link
                                            href={route('admin.vehicles.create', { customer_id: customer.id })}
                                            className="mt-4 inline-flex items-center gap-2 text-amber-600 font-medium"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Vehicle
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Transactions Tab */}
                        {activeTab === 'transactions' && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                                </div>
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${
                                                    transaction.type === 'purchase'
                                                        ? 'bg-blue-100 text-blue-600'
                                                        : 'bg-emerald-100 text-emerald-600'
                                                }`}>
                                                    {transaction.type === 'purchase' ? <Package className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                        {transaction.type}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{transaction.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 dark:text-white">₹{transaction.amount}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                                    transaction.status === 'completed'
                                                        ? 'bg-emerald-100 text-emerald-600'
                                                        : 'bg-amber-100 text-amber-600'
                                                }`}>
                                                    {transaction.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions - Mobile */}
                    <div className="lg:hidden fixed bottom-6 left-4 right-4 flex gap-3 z-10">
                        <Link
                            href={route('admin.customers.edit', customer.id)}
                            className="flex-1 bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2"
                        >
                            <Edit className="w-5 h-5" />
                            Edit
                        </Link>
                        <Link
                            href={route('admin.vehicles.create', { customer_id: customer.id })}
                            className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Vehicle
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </AppLayout>
    );
}

// Helper component for info rows
function InfoRow({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0">
                <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="font-bold text-gray-900 dark:text-white break-words">{value}</p>
            </div>
        </div>
    );
}