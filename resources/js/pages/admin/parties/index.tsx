import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/admin/page-header';
import DataTable from '@/components/admin/data-table';
import { Head, Link } from '@inertiajs/react';
import { 
    Briefcase, Plus, Mail, Phone, LayoutGrid, List, 
    Pencil, MapPin, ShieldCheck, ChevronRight, 
    Users, Building2, FileText, Percent, Star, Truck 
} from 'lucide-react';
import { route } from '@/lib/route';

export default function PartyIndex({ parties }: any) {
    const [viewType, setViewType] = useState<'table' | 'grid'>('grid'); // Default to grid for premium feel

    // Calculate stats
    const totalSuppliers = parties.length;
    const gstCompliant = parties.filter((p: any) => p.gst_number).length;
    const complianceRate = totalSuppliers ? ((gstCompliant / totalSuppliers) * 100).toFixed(0) : 0;
    const activeSuppliers = parties.length; // You can modify this based on your logic

    const columns = [
        {
            header: 'Supplier Identity',
            render: (party: any) => (
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-lg border border-amber-200 dark:border-amber-700 shadow-sm">
                            {party.name.charAt(0)}
                        </div>
                        {party.gst_number && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
                                <ShieldCheck className="w-2.5 h-2.5 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white">{party.name}</span>
                        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300 mt-1">
                            #PRTY-{String(party.id).padStart(6, '0')}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Contact Details',
            render: (party: any) => (
                <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        <div className="p-1 bg-amber-50 dark:bg-amber-900/30 rounded-lg mr-2">
                            <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        {party.mobile}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <div className="p-1 bg-gray-50 dark:bg-gray-700 rounded-lg mr-2">
                            <Mail className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                        </div>
                        {party.email || 'No email provided'}
                    </div>
                </div>
            )
        },
        {
            header: 'GST Compliance',
            render: (party: any) => (
                <div className="flex items-center gap-3">
                    {party.gst_number ? (
                        <>
                            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-semibold">
                                {party.gst_number}
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <ShieldCheck className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            </div>
                            <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg border border-gray-200 dark:border-gray-600 text-xs font-mono">
                                No GST
                            </span>
                        </>
                    )}
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            render: (party: any) => (
                <div className="flex justify-end gap-2">
                    <Link 
                        href={route('admin.parties.edit', { party: party.id })} 
                        className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:text-gray-400 dark:hover:text-amber-400 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-200"
                        title="Edit Supplier"
                    >
                        <Pencil className="w-4 h-4" />
                    </Link>
                    <Link 
                        href={route('admin.parties.show', { party: party.id })} 
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                        title="View Details"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            )
        }
    ];

    return (
        <AppLayout>
            <Head title="Supplier Management" />
            
            {/* Modern Header with Right-aligned Button */}
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl">
                                <Briefcase className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                    Fuel Suppliers
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Manage your fuel vendors and procurement partners.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Premium View Toggle */}
                        <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl border border-gray-200 dark:border-gray-600">
                            <button 
                                onClick={() => setViewType('table')} 
                                className={`p-2.5 rounded-lg transition-all duration-200 ${
                                    viewType === 'table' 
                                        ? 'bg-white dark:bg-gray-800 shadow-sm text-amber-600 dark:text-amber-400 border border-gray-200 dark:border-gray-600' 
                                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                                title="Table View"
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setViewType('grid')} 
                                className={`p-2.5 rounded-lg transition-all duration-200 ${
                                    viewType === 'grid' 
                                        ? 'bg-white dark:bg-gray-800 shadow-sm text-amber-600 dark:text-amber-400 border border-gray-200 dark:border-gray-600' 
                                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                                title="Grid View"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                        </div>

                        <Link 
                            href={route('admin.parties.create')} 
                            className="group relative bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium inline-flex items-center shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                        >
                            <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                            <Plus className="w-4 h-4 mr-2" /> 
                            Add New Supplier
                        </Link>
                    </div>
                </div>

                {/* Premium Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg">
                                <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Total Suppliers</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSuppliers}</p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Active vendors</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">GST Compliant</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gstCompliant}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{complianceRate}% compliance</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg">
                                <Percent className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Active Rate</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">100%</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Currently active</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg">
                                <Star className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Top Suppliers</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {Math.min(5, totalSuppliers)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Premium partners</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {viewType === 'table' ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-gray-900/30 animate-in fade-in duration-500">
                        <DataTable 
                            columns={columns} 
                            data={parties} 
                            emptyMessage="No fuel suppliers registered yet." 
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        {parties.map((party: any, index: number) => (
                            <div 
                                key={party.id} 
                                className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-amber-200 dark:hover:border-amber-700 transition-all duration-300 hover:scale-[1.02]"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Premium Gradient Accent */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-400 dark:from-amber-600 dark:to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />
                                
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-3xl" />
                                </div>

                                <div className="relative">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="relative">
                                            <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl group-hover:from-amber-50 group-hover:to-amber-100 dark:group-hover:from-amber-900/30 dark:group-hover:to-amber-800/30 transition-all duration-300">
                                                <Briefcase className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                                            </div>
                                            {party.gst_number && (
                                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
                                                    <ShieldCheck className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <Link 
                                            href={route('admin.parties.edit', { party: party.id })}
                                            className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 transition-all duration-200"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                            {party.name}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                <MapPin className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                {party.address || 'Central Supply Hub'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100 dark:border-gray-700 mb-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                                                Mobile
                                            </p>
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {party.mobile}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                                                GST Status
                                            </p>
                                            <div className="flex items-center gap-1.5">
                                                <ShieldCheck className={`w-3.5 h-3.5 ${party.gst_number ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                                <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${
                                                    party.gst_number 
                                                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                                }`}>
                                                    {party.gst_number ? 'Registered' : 'Not Registered'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-1.5 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                                            <Mail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <span className="text-xs text-gray-600 dark:text-gray-300 truncate font-medium">
                                            {party.email || 'No email provided'}
                                        </span>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <div className="flex gap-1">
                                            <Link
                                                href={route('admin.parties.show', { party: party.id })}
                                                className="p-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-600 transition-all"
                                                title="View Details"
                                            >
                                                <Truck className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Enhanced Empty State */}
                {parties.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center shadow-xl">
                        <div className="inline-flex p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-2xl mb-6">
                            <Briefcase className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No suppliers yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            Start building your supply chain by adding your first fuel vendor or procurement partner.
                        </p>
                        <Link
                            href={route('admin.parties.create')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-3 rounded-xl text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Add Your First Supplier
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}