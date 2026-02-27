import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/admin/page-header';
import DataTable from '@/components/admin/data-table';
import { Head, Link } from '@inertiajs/react';
import {
    Users, Plus, Phone, Car, LayoutGrid, List,
    Pencil, ChevronRight, UserCircle, Building2,
    Mail, Fuel, CreditCard, Star, TrendingUp,
    MapPin, Clock, Search
} from 'lucide-react';
import { route } from '@/lib/route';

export default function CustomerIndex({ customers }: { customers: any[] }) {
    const [viewType, setViewType] = useState<'table' | 'grid'>('grid');
    const [searchTerm, setSearchTerm] = useState('');

    // Calculate stats
    const totalCustomers = customers.length;
    const totalVehicles = customers.reduce((sum, c) => sum + (c.vehicles_count || 0), 0);
    const avgVehiclesPerCustomer = totalCustomers ? (totalVehicles / totalCustomers).toFixed(1) : 0;
    const corporateCustomers = customers.filter((c: any) => c.company_name).length;

    // Filter customers based on search
    const filteredCustomers = customers.filter((customer: any) =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Define Columns for the Professional Table View
    const columns = [
        {
            header: 'Customer Identity',
            render: (customer: any) => (
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative flex-shrink-0">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-base sm:text-lg border border-amber-200 dark:border-amber-700 shadow-sm">
                            {customer.name?.charAt(0) || 'C'}
                        </div>
                        {customer.vehicles_count > 0 && (
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
                                <Car className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px]">
                            {customer.name}
                        </span>
                        <span className="text-[10px] sm:text-xs font-mono bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300 mt-0.5 sm:mt-1 inline-block w-fit">
                            #CUST-{String(customer.id).padStart(6, '0')}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Organization',
            render: (customer: any) => (
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="p-1 sm:p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg flex-shrink-0">
                        <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px] sm:max-w-[180px]">
                        {customer.company_name || <span className="text-gray-400 dark:text-gray-500 italic">Individual Account</span>}
                    </span>
                </div>
            )
        },
        {
            header: 'Contact & Assets',
            render: (customer: any) => (
                <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        <div className="p-1 bg-amber-50 dark:bg-amber-900/30 rounded-lg mr-1.5 sm:mr-2 flex-shrink-0">
                            <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="truncate max-w-[100px] sm:max-w-[150px]">{customer.mobile}</span>
                    </div>
                    <div className="flex items-center text-[10px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <div className="p-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg mr-1.5 sm:mr-2 flex-shrink-0">
                            <Car className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </div>
                        <span>{customer.vehicles_count || 0} Registered Vehicles</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            render: (customer: any) => (
                <div className="flex justify-end gap-1 sm:gap-2">
                    <Link
                        href={route('admin.customers.show', { customer: customer.id })}
                        className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                        title="View Profile"
                    >
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>
                    <Link
                        href={route('admin.customers.edit', { customer: customer.id })}
                        className="p-1.5 sm:p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:text-gray-400 dark:hover:text-amber-400 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-200"
                        title="Edit Customer"
                    >
                        <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>
                </div>
            )
        }
    ];

    return (
        <AppLayout>
            <Head title="Customer Registry" />

            <div className="space-y-4 sm:space-y-6">
                {/* Premium Header with Icon and Right-aligned Button - Mobile Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm gap-4 sm:gap-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg sm:rounded-xl">
                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                Customer Management
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                                Monitor credit customers and manage their authorized vehicle fleet.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Search Bar - Mobile Optimized */}
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-9 pr-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-400 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
                            href={route('admin.customers.create')}
                            className="group relative bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium inline-flex items-center justify-center shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                        >
                            <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                            <span className="whitespace-nowrap">Add Customer</span>
                        </Link>
                    </div>
                </div>

                {/* Premium Stats Cards - Mobile Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg">
                                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Total Customers</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{totalCustomers}</p>
                                <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 sm:mt-1 flex items-center gap-0.5 sm:gap-1">
                                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    Active accounts
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg">
                                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Corporate</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{corporateCustomers}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">Business accounts</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg">
                                <Car className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Total Vehicles</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{totalVehicles}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">Fleet size</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg">
                                <Fuel className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Avg Vehicles</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{avgVehiclesPerCustomer}</p>
                                <p className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 mt-0.5 sm:mt-1">Per customer</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {viewType === 'table' ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-gray-900/30">
                        <div className="overflow-x-auto">
                            <DataTable
                                columns={columns}
                                data={filteredCustomers}
                                emptyMessage="No customers registered in the fuel registry."
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                        {filteredCustomers.map((customer, index) => (
                            <div
                                key={customer.id}
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
                                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                                        <div className="relative">
                                            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-lg sm:text-xl border border-amber-200 dark:border-amber-700 shadow-sm">
                                                {customer.name?.charAt(0) || 'C'}
                                            </div>
                                            {customer.vehicles_count > 0 && (
                                                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
                                                    <Car className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        <span className="text-[10px] sm:text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 sm:px-2.5 py-1 rounded-full text-gray-600 dark:text-gray-300 font-semibold">
                                            #CUST-{String(customer.id).padStart(6, '0')}
                                        </span>
                                    </div>

                                    <div className="mb-3 sm:mb-4">
                                        <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-0.5 sm:mb-1 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate max-w-[180px] sm:max-w-[220px]">
                                            {customer.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
                                                <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3.5 text-gray-500 dark:text-gray-400" />
                                            </div>
                                            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate max-w-[180px] sm:max-w-[220px]">
                                                {customer.company_name || 'Individual Account'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 sm:space-y-3 py-3 sm:py-4 border-y border-gray-100 dark:border-gray-700 mb-3 sm:mb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <div className="p-1 sm:p-1.5 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                                                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400" />
                                                </div>
                                                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-[150px]">
                                                    {customer.mobile}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-0.5 sm:gap-1">
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full"></div>
                                                <span className="text-[8px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                                    Active
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <div className="p-1 sm:p-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex-shrink-0">
                                                <Car className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <span className="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-300">
                                                {customer.vehicles_count || 0} Registered Vehicles
                                            </span>
                                            <span className="text-[8px] sm:text-xs text-gray-400 dark:text-gray-500 ml-auto">
                                                Fleet
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={route('admin.customers.show', { customer: customer.id })}
                                            className="flex-1 text-center text-[10px] sm:text-xs font-bold py-2.5 sm:py-3 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 hover:from-amber-600 hover:to-amber-500 text-amber-700 dark:text-amber-300 hover:text-white rounded-lg sm:rounded-xl transition-all duration-200 uppercase tracking-wider"
                                        >
                                            View Profile
                                        </Link>
                                        <Link
                                            href={route('admin.customers.edit', { customer: customer.id })}
                                            className="p-2.5 sm:p-3 bg-gray-100 dark:bg-gray-700 hover:bg-amber-600 dark:hover:bg-amber-600 text-gray-500 dark:text-gray-400 hover:text-white rounded-lg sm:rounded-xl transition-all duration-200"
                                            title="Edit Customer"
                                        >
                                            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </Link>
                                    </div>

                                    {/* Quick Stats Footer */}
                                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[10px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-0.5 sm:gap-1">
                                            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                            <span>Recent</span>
                                        </div>
                                        <div className="flex items-center gap-0.5 sm:gap-1">
                                            <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                            <span>Credit</span>
                                        </div>
                                        <div className="flex items-center gap-0.5 sm:gap-1 ml-auto">
                                            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                                            <span>Premium</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Premium Empty State - Mobile Responsive */}
                {filteredCustomers.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 lg:p-12 text-center shadow-xl">
                        <div className="inline-flex p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                            <Users className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                            {searchTerm ? 'No customers found' : 'No customers yet'}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-2">
                            {searchTerm
                                ? `No customers match "${searchTerm}". Try a different search term.`
                                : 'Start building your customer base by adding credit customers and managing their vehicle fleet.'}
                        </p>
                        {!searchTerm && (
                            <Link
                                href={route('admin.customers.create')}
                                className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                            >
                                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Add Your First Customer
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}