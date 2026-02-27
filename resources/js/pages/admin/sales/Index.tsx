import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/admin/page-header';
import { Head, Link } from '@inertiajs/react';
import {
    ShoppingBag, Pencil, Trash2, Printer, Search,
    LayoutGrid, List, Eye, Calendar, Users, Car,
    TrendingUp, DollarSign, FileText, Clock, Fuel,
    ArrowUpRight, CreditCard, Download, ChevronRight, Filter
} from 'lucide-react';
import { route } from '@/lib/route';

export default function SaleIndex({ sales, customers, vehicles }: any) {
    const [viewType, setViewType] = useState<'table' | 'grid'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [customerFilter, setCustomerFilter] = useState('');
    const [vehicleFilter, setVehicleFilter] = useState('');

    // Calculate stats
    const totalSales = sales.length;
    const totalAmount = sales.reduce((sum: number, s: any) => sum + parseFloat(s.total_amount), 0);
    const totalCustomers = new Set(sales.map((s: any) => s.customer?.id)).size;
    const totalVehicles = new Set(sales.map((s: any) => s.vehicle?.id)).size;

    const clearFilters = () => {
        setDateFrom('');
        setDateTo('');
        setCustomerFilter('');
        setVehicleFilter('');
        setSearchTerm('');
    };

    const hasActiveFilters = dateFrom || dateTo || customerFilter || vehicleFilter;

    // Filter sales based on search + date + customer + vehicle
    const filteredSales = sales.filter((sale: any) => {
        const matchesSearch = !searchTerm ||
            sale.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.vehicle?.vehicle_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.id?.toString().includes(searchTerm);

        const saleDate = sale.sale_date ? new Date(sale.sale_date) : null;
        const matchesDateFrom = !dateFrom || (saleDate && saleDate >= new Date(dateFrom));
        const matchesDateTo = !dateTo || (saleDate && saleDate <= new Date(dateTo + 'T23:59:59'));

        const matchesCustomer = !customerFilter || sale.customer?.id?.toString() === customerFilter;
        const matchesVehicle = !vehicleFilter || sale.vehicle?.id?.toString() === vehicleFilter;

        return matchesSearch && matchesDateFrom && matchesDateTo && matchesCustomer && matchesVehicle;
    });

    const getAmountColor = (amount: number) => {
        if (amount > 10000) return 'from-amber-600 to-orange-600';
        if (amount > 5000) return 'from-amber-500 to-amber-600';
        return 'from-emerald-600 to-teal-600';
    };

    const getSaleType = (amount: number) => {
        if (amount > 10000) return { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', label: 'Bulk Sale' };
        if (amount > 5000) return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', label: 'Large' };
        return { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', label: 'Regular' };
    };

    return (
        <AppLayout>
            <Head title="Sales Ledger" />

            <div className="space-y-4 sm:space-y-6">
                {/* Premium Header with Icon and Right-aligned Button - Mobile Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm gap-4 sm:gap-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg sm:rounded-xl">
                            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                Sales History
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                                Comprehensive list of fuel sales and generated invoices.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Search Bar - Mobile Optimized */}
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search invoices..."
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
                                className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 ${viewType === 'table'
                                    ? 'bg-white dark:bg-gray-800 shadow-sm text-amber-600 dark:text-amber-400 border border-gray-200 dark:border-gray-600'
                                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                    }`}
                                title="Table View"
                            >
                                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button
                                onClick={() => setViewType('grid')}
                                className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 ${viewType === 'grid'
                                    ? 'bg-white dark:bg-gray-800 shadow-sm text-amber-600 dark:text-amber-400 border border-gray-200 dark:border-gray-600'
                                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                    }`}
                                title="Grid View"
                            >
                                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </div>

                        <Link
                            href={route('admin.sales.create')}
                            className="group relative bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium inline-flex items-center justify-center shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                        >
                            <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                            <span className="whitespace-nowrap">New Sale</span>
                        </Link>
                    </div>
                </div>

                {/* Filter Bar - Date, Customer & Vehicle Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-3 sm:p-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400 flex-shrink-0">
                            <Filter className="w-4 h-4 text-amber-500" />
                            <span className="text-xs sm:text-sm font-semibold">Filters</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-1">
                            {/* Date From */}
                            <div className="relative flex-1 sm:max-w-[160px]">
                                <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium mb-0.5 block">From Date</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full px-3 py-1.5 sm:py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-400 transition-all text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Date To */}
                            <div className="relative flex-1 sm:max-w-[160px]">
                                <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium mb-0.5 block">To Date</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full px-3 py-1.5 sm:py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-400 transition-all text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Customer Filter */}
                            <div className="relative flex-1 sm:max-w-[180px]">
                                <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium mb-0.5 block">Customer</label>
                                <select
                                    value={customerFilter}
                                    onChange={(e) => setCustomerFilter(e.target.value)}
                                    className="w-full px-3 py-1.5 sm:py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-400 transition-all text-gray-900 dark:text-white appearance-none"
                                >
                                    <option value="">All Customers</option>
                                    {customers?.map((c: any) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Vehicle Filter */}
                            <div className="relative flex-1 sm:max-w-[180px]">
                                <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium mb-0.5 block">Vehicle</label>
                                <select
                                    value={vehicleFilter}
                                    onChange={(e) => setVehicleFilter(e.target.value)}
                                    className="w-full px-3 py-1.5 sm:py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-400 transition-all text-gray-900 dark:text-white appearance-none"
                                >
                                    <option value="">All Vehicles</option>
                                    {vehicles?.map((v: any) => (
                                        <option key={v.id} value={v.id}>{v.vehicle_number}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all self-end sm:self-center whitespace-nowrap"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Premium Stats Cards - Mobile Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg">
                                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Total Sales</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{totalSales}</p>
                                <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 mt-0.5 sm:mt-1 flex items-center gap-0.5 sm:gap-1">
                                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    Lifetime transactions
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg">
                                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Total Revenue</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </p>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">Gross sales</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg">
                                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Customers</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{totalCustomers}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">Active buyers</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg">
                                <Car className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Vehicles</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{totalVehicles}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">Served</p>
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
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Invoice & Date</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Vehicle</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredSales.map((sale: any, index: number) => {
                                        const type = getSaleType(sale.total_amount);
                                        return (
                                            <tr
                                                key={sale.id}
                                                className="group hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-gray-50/40 dark:hover:from-gray-700/40 dark:hover:to-gray-700/20 transition-all duration-200"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="relative flex-shrink-0">
                                                            <div className="p-1.5 sm:p-2 lg:p-2.5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg sm:rounded-xl">
                                                                <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-amber-600 dark:text-amber-400" />
                                                            </div>
                                                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full ring-1 sm:ring-2 ring-white dark:ring-gray-800"></div>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 dark:text-white truncate max-w-[100px] sm:max-w-[150px] lg:max-w-[200px]">
                                                                {sale.invoice_number}
                                                            </p>
                                                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-0.5 sm:gap-1">
                                                                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                                {new Date(sale.sale_date).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                                        <div className="p-1 sm:p-1.5 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                                                            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[80px] sm:max-w-[120px] lg:max-w-[150px]">
                                                                {sale.customer?.name || 'Walk-in Customer'}
                                                            </p>
                                                            {sale.customer?.company_name && (
                                                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate max-w-[80px] sm:max-w-[120px] lg:max-w-[150px]">
                                                                    {sale.customer.company_name}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                    <span className="font-mono text-[10px] sm:text-xs bg-gray-100 dark:bg-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">
                                                        {sale.vehicle?.vehicle_number || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                        <span className={`text-xs sm:text-sm lg:text-base font-bold bg-gradient-to-r ${getAmountColor(sale.total_amount)} bg-clip-text text-transparent whitespace-nowrap`}>
                                                            ₹{parseFloat(sale.total_amount).toLocaleString('en-IN', {
                                                                maximumFractionDigits: 0
                                                            })}
                                                        </span>
                                                        <span className={`px-1.5 sm:px-2 py-0.5 ${type.color} rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap self-start sm:self-auto`}>
                                                            {type.label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 text-right">
                                                    <div className="flex justify-end gap-1 sm:gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                                                        <a
                                                            href={route('admin.sales.invoice', { sale: sale.id })}
                                                            className="p-1.5 sm:p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-gray-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/30 rounded-lg transition-all duration-200"
                                                            title="Download Invoice"
                                                        >
                                                            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </a>
                                                        <Link
                                                            href={route('admin.sales.edit', { sale: sale.id })}
                                                            className="p-1.5 sm:p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:text-gray-400 dark:hover:text-amber-400 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-200"
                                                            title="Edit Sale"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </Link>
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
                        {filteredSales.map((sale: any, index: number) => {
                            const type = getSaleType(sale.total_amount);
                            return (
                                <div
                                    key={sale.id}
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
                                                    <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
                                                </div>
                                                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
                                                    <FileText className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] sm:text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 sm:px-2.5 py-1 rounded-full text-gray-600 dark:text-gray-300 font-semibold truncate max-w-[120px] sm:max-w-[150px]">
                                                    {sale.invoice_number}
                                                </span>
                                                <span className={`mt-1.5 sm:mt-2 text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${type.color}`}>
                                                    {type.label}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-3 sm:mb-4">
                                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                                <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
                                                    <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[180px]">
                                                        {sale.customer?.name || 'Walk-in Customer'}
                                                    </p>
                                                    {sale.customer?.company_name && (
                                                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px] sm:max-w-[180px]">
                                                            {sale.customer.company_name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
                                                    <Car className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400" />
                                                </div>
                                                <span className="font-mono text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[150px] sm:max-w-[180px]">
                                                    {sale.vehicle?.vehicle_number || 'No vehicle'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-3 sm:py-4 border-y border-gray-100 dark:border-gray-700 mb-3 sm:mb-4">
                                            <div className="min-w-0">
                                                <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                                                    Sale Date
                                                </p>
                                                <div className="flex items-center gap-1 sm:gap-1.5">
                                                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-[150px]">
                                                        {new Date(sale.sale_date).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1 text-right">
                                                    Payment
                                                </p>
                                                <span className="text-[10px] sm:text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                                                    Paid
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                                            <div className="min-w-0">
                                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                                                    Total Amount
                                                </p>
                                                <span className={`text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r ${getAmountColor(sale.total_amount)} bg-clip-text text-transparent truncate max-w-[120px] sm:max-w-[150px]`}>
                                                    ₹{parseFloat(sale.total_amount).toLocaleString('en-IN', {
                                                        maximumFractionDigits: 0
                                                    })}
                                                </span>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                                                    Fuel
                                                </p>
                                                <div className="flex items-center gap-0.5 sm:gap-1">
                                                    <Fuel className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                                                    <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                                                        {
                                                            sale.items
                                                                ? sale.items.reduce(
                                                                    (sum: number, item: any) => sum + parseFloat(item.quantity),
                                                                    0
                                                                ).toFixed(2)
                                                                : 0
                                                        } L
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <a
                                                href={route('admin.sales.invoice', { sale: sale.id })}
                                                className="flex-1 text-center text-[10px] sm:text-xs font-bold py-2.5 sm:py-3 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 hover:from-emerald-600 hover:to-emerald-500 text-emerald-700 dark:text-emerald-300 hover:text-white rounded-lg sm:rounded-xl transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-1"
                                            >
                                                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                Invoice
                                            </a>
                                            <Link
                                                href={route('admin.sales.edit', { sale: sale.id })}
                                                className="flex-1 text-center text-[10px] sm:text-xs font-bold py-2.5 sm:py-3 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 hover:from-amber-600 hover:to-amber-500 text-amber-700 dark:text-amber-300 hover:text-white rounded-lg sm:rounded-xl transition-all duration-200 uppercase tracking-wider"
                                            >
                                                Edit Sale
                                            </Link>
                                        </div>

                                        {/* Quick Stats Footer */}
                                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[10px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-0.5 sm:gap-1">
                                                <Fuel className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                <span className="hidden xs:inline">Fuel sale</span>
                                                <span className="inline xs:hidden">Fuel</span>
                                            </div>
                                            <div className="flex items-center gap-0.5 sm:gap-1">
                                                <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                <span className="hidden xs:inline">Cash/Credit</span>
                                                <span className="inline xs:hidden">Credit</span>
                                            </div>
                                            <div className="flex items-center gap-0.5 sm:gap-1 ml-auto">
                                                <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                                                <span>Complete</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Premium Empty State - Mobile Responsive */}
                {filteredSales.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 lg:p-12 text-center shadow-xl">
                        <div className="inline-flex p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                            {searchTerm ? 'No sales found' : 'No sales recorded yet'}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-2">
                            {searchTerm
                                ? `No sales match "${searchTerm}". Try a different search term.`
                                : 'Start tracking your fuel sales by creating your first invoice.'}
                        </p>
                        {!searchTerm && (
                            <Link
                                href={route('admin.sales.create')}
                                className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                            >
                                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Create Your First Sale
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}