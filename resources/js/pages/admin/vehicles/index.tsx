import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/admin/page-header';
import { Head, Link } from '@inertiajs/react';
import { 
    Truck, Plus, User, Search, LayoutGrid, List,
    Fuel, Gauge, Calendar, Shield, Activity,
    ChevronRight, Pencil, MoreHorizontal, Users,
    ArrowUpRight, Clock, Wrench, Battery
} from 'lucide-react';
import { route } from '@/lib/route';

export default function VehicleIndex({ vehicles }: any) {
    const [viewType, setViewType] = useState<'table' | 'grid'>('grid');
    const [searchTerm, setSearchTerm] = useState('');

    // Calculate stats
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter((v: any) => v.is_active).length;
    const inactiveVehicles = vehicles.filter((v: any) => !v.is_active).length;
    const vehicleTypes = [...new Set(vehicles.map((v: any) => v.vehicle_type))].length;

    // Filter vehicles based on search
    const filteredVehicles = vehicles.filter((vehicle: any) => 
        vehicle.vehicle_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vehicle_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getVehicleIcon = (type: string) => {
        switch(type?.toLowerCase()) {
            case 'truck':
            case 'lorry':
                return <Truck className="w-5 h-5" />;
            case 'car':
            case 'sedan':
            case 'hatchback':
                return <Users className="w-5 h-5" />;
            default:
                return <Truck className="w-5 h-5" />;
        }
    };

    return (
        <AppLayout>
            <Head title="Vehicle Registry" />
            
            <div className="space-y-4 sm:space-y-6">
                {/* Premium Header with Icon and Right-aligned Button - Mobile Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm gap-4 sm:gap-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg sm:rounded-xl">
                            <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                Vehicle Registry
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                                Manage all vehicles registered under customers and monitor fleet status.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Search Bar - Mobile Optimized */}
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search vehicles..."
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
                            href={route('admin.vehicles.create')} 
                            className="group relative bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium inline-flex items-center justify-center shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                        >
                            <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> 
                            <span className="whitespace-nowrap">Register Vehicle</span>
                        </Link>
                    </div>
                </div>

                {/* Premium Stats Cards - Mobile Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg">
                                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Total Vehicles</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{totalVehicles}</p>
                                <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 sm:mt-1 flex items-center gap-0.5 sm:gap-1">
                                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    Fleet size
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg">
                                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Active</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{activeVehicles}</p>
                                <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 sm:mt-1">
                                    {totalVehicles ? Math.round((activeVehicles / totalVehicles) * 100) : 0}% operational
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-800/30 rounded-lg">
                                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Inactive</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{inactiveVehicles}</p>
                                <p className="text-[10px] sm:text-xs text-rose-600 dark:text-rose-400 mt-0.5 sm:mt-1">
                                    Needs attention
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg">
                                <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Vehicle Types</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{vehicleTypes}</p>
                                <p className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 mt-0.5 sm:mt-1">
                                    Different categories
                                </p>
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
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Vehicle Details</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredVehicles.map((vehicle: any, index: number) => (
                                        <tr 
                                            key={vehicle.id} 
                                            className="group hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-gray-50/40 dark:hover:from-gray-700/40 dark:hover:to-gray-700/20 transition-all duration-200"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <div className="relative flex-shrink-0">
                                                        <div className="p-1.5 sm:p-2 lg:p-2.5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg sm:rounded-xl">
                                                            <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-amber-600 dark:text-amber-400" />
                                                        </div>
                                                        {vehicle.is_active && (
                                                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full ring-1 sm:ring-2 ring-white dark:ring-gray-800"></div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider truncate max-w-[120px] sm:max-w-[180px]">
                                                            {vehicle.vehicle_number}
                                                        </p>
                                                        <span className="text-[8px] sm:text-[10px] lg:text-xs font-mono bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300 mt-0.5 inline-block">
                                                            #VEH-{String(vehicle.id).padStart(6, '0')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <div className="p-1 sm:p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                                                        {getVehicleIcon(vehicle.vehicle_type)}
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white capitalize truncate max-w-[80px] sm:max-w-[120px]">
                                                        {vehicle.vehicle_type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[100px] sm:max-w-[150px]">
                                                        {vehicle.customer?.name}
                                                    </span>
                                                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px] sm:max-w-[150px]">
                                                        {vehicle.customer?.company_name || 'Individual'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                                                    vehicle.is_active 
                                                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                                                        : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                                }`}>
                                                    <span className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${vehicle.is_active ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                                                    {vehicle.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 text-right">
                                                <div className="flex justify-end gap-1 sm:gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={route('admin.vehicles.edit', { vehicle: vehicle.id })}
                                                        className="p-1.5 sm:p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:text-gray-400 dark:hover:text-amber-400 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-200"
                                                        title="Edit Vehicle"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                        {filteredVehicles.map((vehicle: any, index: number) => (
                            <div 
                                key={vehicle.id} 
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
                                                <Truck className="w-6 h-6 sm:w-7 sm:h-7" />
                                            </div>
                                            <div className={`absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center ${
                                                vehicle.is_active ? 'bg-emerald-500' : 'bg-rose-500'
                                            }`}>
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                        
                                        <span className="text-[10px] sm:text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 sm:px-2.5 py-1 rounded-full text-gray-600 dark:text-gray-300 font-semibold">
                                            #VEH-{String(vehicle.id).padStart(6, '0')}
                                        </span>
                                    </div>

                                    <div className="mb-3 sm:mb-4">
                                        <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-0.5 sm:mb-1 uppercase tracking-wider group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate max-w-[180px] sm:max-w-[220px]">
                                            {vehicle.vehicle_number}
                                        </h3>
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
                                                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400" />
                                            </div>
                                            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[180px] sm:max-w-[220px]">
                                                {vehicle.customer?.name}
                                            </p>
                                        </div>
                                        {vehicle.customer?.company_name && (
                                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1 ml-6 sm:ml-7 truncate">
                                                {vehicle.customer.company_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 sm:gap-3 py-3 sm:py-4 border-y border-gray-100 dark:border-gray-700 mb-3 sm:mb-4">
                                        <div className="min-w-0">
                                            <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                                                Type
                                            </p>
                                            <div className="flex items-center gap-1 sm:gap-1.5">
                                                <div className="p-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                                                    {getVehicleIcon(vehicle.vehicle_type)}
                                                </div>
                                                <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white capitalize truncate">
                                                    {vehicle.vehicle_type}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                                                Status
                                            </p>
                                            <div className="flex items-center gap-1 sm:gap-1.5">
                                                <div className={`p-1 rounded-lg flex-shrink-0 ${
                                                    vehicle.is_active 
                                                        ? 'bg-emerald-50 dark:bg-emerald-900/30' 
                                                        : 'bg-rose-50 dark:bg-rose-900/30'
                                                }`}>
                                                    <Activity className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                                        vehicle.is_active 
                                                            ? 'text-emerald-600 dark:text-emerald-400' 
                                                            : 'text-rose-600 dark:text-rose-400'
                                                    }`} />
                                                </div>
                                                <span className={`text-[10px] sm:text-xs font-bold ${
                                                    vehicle.is_active 
                                                        ? 'text-emerald-700 dark:text-emerald-300' 
                                                        : 'text-rose-700 dark:text-rose-300'
                                                }`}>
                                                    {vehicle.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link 
                                            href={route('admin.vehicles.edit', { vehicle: vehicle.id })} 
                                            className="flex-1 text-center text-[10px] sm:text-xs font-bold py-2.5 sm:py-3 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 hover:from-amber-600 hover:to-amber-500 text-amber-700 dark:text-amber-300 hover:text-white rounded-lg sm:rounded-xl transition-all duration-200 uppercase tracking-wider"
                                        >
                                            Edit Vehicle
                                        </Link>
                                    </div>

                                    {/* Quick Stats Footer */}
                                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[10px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-0.5 sm:gap-1">
                                            <Fuel className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                            <span>Diesel</span>
                                        </div>
                                        <div className="flex items-center gap-0.5 sm:gap-1">
                                            <Gauge className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                            <span>Active</span>
                                        </div>
                                        <div className="flex items-center gap-0.5 sm:gap-1 ml-auto">
                                            <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                                            <span>Insured</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Premium Empty State - Mobile Responsive */}
                {filteredVehicles.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 lg:p-12 text-center shadow-xl">
                        <div className="inline-flex p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                            <Truck className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                            {searchTerm ? 'No vehicles found' : 'No vehicles registered yet'}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-2">
                            {searchTerm 
                                ? `No vehicles match "${searchTerm}". Try a different search term.`
                                : 'Start building your fleet by registering vehicles under customer accounts.'}
                        </p>
                        {!searchTerm && (
                            <Link
                                href={route('admin.vehicles.create')}
                                className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                            >
                                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Register Your First Vehicle
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}