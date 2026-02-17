import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/admin/page-header';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Plus, Eye, Pencil, Trash2, ShoppingCart, Calendar,
    FileText, Truck, Package, TrendingUp, Fuel, Receipt,
    ArrowUpRight, Clock, DollarSign, LayoutGrid, List,
    Search, Filter, Download, ChevronRight
} from 'lucide-react';
import { route } from '@/lib/route';

export default function PurchaseIndex({ purchases }: any) {
    const { delete: destroy } = useForm();
    const [viewType, setViewType] = useState<'table' | 'grid'>('grid');
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this purchase? Stock will be adjusted accordingly.')) {
            destroy(route('admin.purchases.destroy', { purchase: id }));
        }
    };

    const getAmountColor = (amount: number) => {
        if (amount > 100000) return 'from-amber-600 to-orange-600';
        if (amount > 50000) return 'from-amber-500 to-amber-600';
        return 'from-emerald-600 to-teal-600';
    };

    const getStatusBadge = (amount: number) => {
        if (amount > 100000) return { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', label: 'Bulk Order' };
        if (amount > 50000) return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', label: 'Large Order' };
        return { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', label: 'Regular' };
    };

    // Calculate stats
    const totalPurchases = purchases.length;
    const totalSuppliers = new Set(purchases.map((p: any) => p.party?.id)).size;
    const totalAmount = purchases.reduce((sum: number, p: any) => sum + parseFloat(p.total_amount), 0);
    const thisMonth = purchases.filter((p: any) => {
        const date = new Date(p.purchase_date);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    const avgPurchaseAmount = totalPurchases ? totalAmount / totalPurchases : 0;
    const bulkOrders = purchases.filter((p: any) => parseFloat(p.total_amount) > 100000).length;

    // Filter purchases based on search
    const filteredPurchases = purchases.filter((purchase: any) => 
        purchase.party?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.bill_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.id?.toString().includes(searchTerm)
    );

    return (
        <AppLayout>
            <Head title="Purchase Management" />

            <div className="space-y-4 sm:space-y-6">
                {/* Premium Header with Icon and Right-aligned Button - Mobile Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm gap-4 sm:gap-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg sm:rounded-xl">
                            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                Purchase Management
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                                Track and manage all fuel and lubricant procurements.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Search Bar - Mobile Optimized */}
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search purchases..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-9 pr-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-400 transition-all"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 sm:top-3" />
                        </div>

                        {/* Premium View Toggle */}
                        <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 self-start sm:self-auto">
                            <button 
                                onClick={() => setViewType('table')} 
                                className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 ${
                                    viewType === 'table' 
                                        ? 'bg-white dark:bg-gray-800 shadow-sm text-amber-600 dark:text-amber-400 border border-gray-200 dark:border-gray-600' 
                                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                                title="Table View"
                            >
                                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button 
                                onClick={() => setViewType('grid')} 
                                className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 ${
                                    viewType === 'grid' 
                                        ? 'bg-white dark:bg-gray-800 shadow-sm text-amber-600 dark:text-amber-400 border border-gray-200 dark:border-gray-600' 
                                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                                title="Grid View"
                            >
                                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </div>

                        <Link
                            href={route('admin.purchases.create')}
                            className="group relative bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium inline-flex items-center justify-center shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                        >
                            <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                            <span className="whitespace-nowrap">Record Purchase</span>
                        </Link>
                    </div>
                </div>

                {/* Premium Stats Cards - Mobile Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg">
                                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Total Purchases</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{totalPurchases}</p>
                                <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 mt-0.5 sm:mt-1 flex items-center gap-0.5 sm:gap-1">
                                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    Lifetime orders
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg">
                                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Total Suppliers</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{totalSuppliers}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">Active vendors</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg">
                                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Total Amount</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </p>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">Total spend</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">This Month</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{thisMonth}</p>
                                <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 mt-0.5 sm:mt-1 flex items-center gap-0.5 sm:gap-1">
                                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    Current period
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Stats Row - Amber Themed */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg sm:rounded-xl border border-amber-100 dark:border-amber-800/30 p-4 sm:p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-300 uppercase tracking-wider font-medium">Average Purchase Value</p>
                                <p className="text-xl sm:text-2xl font-bold text-amber-800 dark:text-amber-200 mt-0.5 sm:mt-1">
                                    ₹{avgPurchaseAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                            <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg sm:rounded-xl border border-amber-100 dark:border-amber-800/30 p-4 sm:p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-300 uppercase tracking-wider font-medium">Bulk Orders</p>
                                <p className="text-xl sm:text-2xl font-bold text-amber-800 dark:text-amber-200 mt-0.5 sm:mt-1">
                                    {bulkOrders}
                                </p>
                            </div>
                            <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg sm:rounded-xl border border-amber-100 dark:border-amber-800/30 p-4 sm:p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-300 uppercase tracking-wider font-medium">Pending Bills</p>
                                <p className="text-xl sm:text-2xl font-bold text-amber-800 dark:text-amber-200 mt-0.5 sm:mt-1">0</p>
                            </div>
                            <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {viewType === 'table' ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-gray-900/30">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Date & Reference</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Supplier</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Bill Number</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Total Amount</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredPurchases.map((purchase: any, index: number) => {
                                        const status = getStatusBadge(purchase.total_amount);
                                        return (
                                            <tr
                                                key={purchase.id}
                                                className="group hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-gray-50/40 dark:hover:from-gray-700/40 dark:hover:to-gray-700/20 transition-all duration-200"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="relative flex-shrink-0">
                                                            <div className="p-1.5 sm:p-2 lg:p-2.5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg sm:rounded-xl">
                                                                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-amber-600 dark:text-amber-400" />
                                                            </div>
                                                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full ring-1 sm:ring-2 ring-white dark:ring-gray-800"></div>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                                                                {new Date(purchase.purchase_date).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                            <span className="text-[10px] sm:text-xs font-mono bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300 mt-0.5 inline-block">
                                                                #PUR-{String(purchase.id).padStart(6, '0')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                                        <div className="p-1 sm:p-1.5 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                                                            <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400" />
                                                        </div>
                                                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[100px] sm:max-w-[150px]">
                                                            {purchase.party?.name || 'N/A'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                    <span className="font-mono text-[10px] sm:text-xs bg-amber-50 dark:bg-amber-900/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-semibold whitespace-nowrap">
                                                        {purchase.bill_number || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                        <span className={`text-xs sm:text-sm lg:text-base font-bold bg-gradient-to-r ${getAmountColor(purchase.total_amount)} bg-clip-text text-transparent`}>
                                                            ₹{parseFloat(purchase.total_amount).toLocaleString('en-IN', {
                                                                maximumFractionDigits: 0
                                                            })}
                                                        </span>
                                                        <span className={`px-1.5 sm:px-2 py-0.5 ${status.color} rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap self-start sm:self-auto`}>
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 text-right">
                                                    <div className="flex justify-end gap-1 sm:gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                                                        <Link
                                                            href={route('admin.purchases.edit', { purchase: purchase.id })}
                                                            className="p-1.5 sm:p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:text-gray-400 dark:hover:text-amber-400 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-200"
                                                            title="Edit Purchase"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(purchase.id)}
                                                            className="p-1.5 sm:p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:text-gray-400 dark:hover:text-rose-400 dark:hover:bg-rose-900/30 rounded-lg transition-all duration-200"
                                                            title="Delete Purchase"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                        {filteredPurchases.map((purchase: any, index: number) => {
                            const status = getStatusBadge(purchase.total_amount);
                            return (
                                <div 
                                    key={purchase.id} 
                                    className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-xl hover:border-amber-200 dark:hover:border-amber-700 transition-shadow duration-300"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Premium Gradient Accent */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-400 dark:from-amber-600 dark:to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-xl sm:rounded-t-2xl" />
                                    
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-3xl" />
                                    </div>

                                    <div className="relative">
                                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                                            <div className="relative">
                                                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-700 shadow-sm">
                                                    <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
                                                </div>
                                                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
                                                    <FileText className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                                                </div>
                                            </div>
                                            
                                            <span className="text-[10px] sm:text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 sm:px-2.5 py-1 rounded-full text-gray-600 dark:text-gray-300 font-semibold">
                                                #PUR-{String(purchase.id).padStart(6, '0')}
                                            </span>
                                        </div>

                                        <div className="mb-3 sm:mb-4">
                                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                                                <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate max-w-[180px] sm:max-w-[200px]">
                                                    {purchase.party?.name || 'N/A'}
                                                </h3>
                                                <span className={`text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${status.color} whitespace-nowrap`}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
                                                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400" />
                                                </div>
                                                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {new Date(purchase.purchase_date).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 py-3 sm:py-4 border-y border-gray-100 dark:border-gray-700 mb-3 sm:mb-4">
                                            <div className="min-w-0">
                                                <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                                                    Bill Number
                                                </p>
                                                <div className="flex items-center gap-1 sm:gap-1.5">
                                                    <div className="p-1 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                                                        <Receipt className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400" />
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-mono font-semibold text-gray-900 dark:text-white truncate">
                                                        {purchase.bill_number || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                                                    Supplier ID
                                                </p>
                                                <div className="flex items-center gap-1 sm:gap-1.5">
                                                    <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
                                                        <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400" />
                                                    </div>
                                                    <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300 truncate">
                                                        {purchase.party?.id ? `#SUP-${String(purchase.party.id).padStart(6, '0')}` : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                                            <div>
                                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                                                    Total Amount
                                                </p>
                                                <span className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${getAmountColor(purchase.total_amount)} bg-clip-text text-transparent`}>
                                                    ₹{parseFloat(purchase.total_amount).toLocaleString('en-IN', {
                                                        maximumFractionDigits: 0
                                                    })}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                                                    Items
                                                </p>
                                                <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                                    {purchase.items?.length || 0}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link 
                                                href={route('admin.purchases.edit', { purchase: purchase.id })} 
                                                className="flex-1 text-center text-[10px] sm:text-xs font-bold py-2.5 sm:py-3 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 hover:from-amber-600 hover:to-amber-500 text-amber-700 dark:text-amber-300 hover:text-white rounded-lg sm:rounded-xl transition-all duration-200 uppercase tracking-wider"
                                            >
                                                Edit Purchase
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(purchase.id)}
                                                className="p-2.5 sm:p-3 bg-gray-100 dark:bg-gray-700 hover:bg-rose-600 dark:hover:bg-rose-600 text-gray-500 dark:text-gray-400 hover:text-white rounded-lg sm:rounded-xl transition-all duration-200"
                                                title="Delete Purchase"
                                            >
                                                <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>

                                        {/* Quick Stats Footer */}
                                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[10px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-0.5 sm:gap-1">
                                                <Package className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                <span>{purchase.items?.length || 0} products</span>
                                            </div>
                                            <div className="flex items-center gap-0.5 sm:gap-1">
                                                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                <span>Recorded</span>
                                            </div>
                                            <div className="flex items-center gap-0.5 sm:gap-1 ml-auto">
                                                <DollarSign className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                                                <span>Paid</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Premium Empty State - Mobile Responsive */}
                {filteredPurchases.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 lg:p-12 text-center shadow-xl">
                        <div className="inline-flex p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                            <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                            {searchTerm ? 'No purchases found' : 'No purchases yet'}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-2">
                            {searchTerm 
                                ? `No purchases match "${searchTerm}". Try a different search term.`
                                : 'Start tracking your fuel and lubricant procurements by recording your first purchase order.'}
                        </p>
                        {!searchTerm && (
                            <Link
                                href={route('admin.purchases.create')}
                                className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                            >
                                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Record Your First Purchase
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}