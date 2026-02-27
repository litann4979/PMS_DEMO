import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Plus, Pencil, Search, Fuel,
    Building2, Activity, ChevronRight,
    MousePointer2, Layers, MapPin, Trash2, X, Check,
    Network, Globe2, AlertCircle, Filter
} from 'lucide-react';
import { route } from '@/lib/route';

interface Pump {
    id: number;
    pump_number: string;
    station: {
        id: number;
        name: string;
    };
    station_id: number;
}

interface Station {
    id: number;
    name: string;
}

interface Props {
    pumps: Pump[];
    stations: Station[];
}

export default function Index({ pumps, stations }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStation, setFilterStation] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showMobileForm, setShowMobileForm] = useState(false);
    const [selectedPump, setSelectedPump] = useState<Pump | null>(null);
    const [showMobileDetails, setShowMobileDetails] = useState(false);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        station_id: '',
        pump_number: ''
    });

    const totalPumps = pumps.length;
    const totalStations = stations.length;

    const filteredPumps = pumps.filter(p => {
        const matchesSearch = p.pump_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.station.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStation = !filterStation || p.station_id.toString() === filterStation;
        return matchesSearch && matchesStation;
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.pumps.update', editingId), {
                onSuccess: () => {
                    reset();
                    setEditingId(null);
                    setShowMobileForm(false);
                }
            });
        } else {
            post(route('admin.pumps.store'), {
                onSuccess: () => {
                    reset();
                    setShowMobileForm(false);
                }
            });
        }
    };

    const handleEdit = (pump: Pump) => {
        setEditingId(pump.id);
        setData({
            station_id: pump.station_id.toString(),
            pump_number: pump.pump_number
        });
        setShowMobileForm(true);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        reset();
        setShowMobileForm(false);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this pump?')) {
            router.delete(route('admin.pumps.destroy', id));
        }
    };

    const handleViewDetails = (pump: Pump) => {
        setSelectedPump(pump);
        setShowMobileDetails(true);
    };

    return (
        <AppLayout>
            <Head title="Pump Management" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
                {/* Mobile Header - Sticky */}
                <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <Fuel className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 dark:text-white">Pumps</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{totalPumps} active</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowMobileForm(!showMobileForm)}
                            className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600"
                        >
                            {showMobileForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Mobile Search */}
                    <div className="px-4 pb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search pumps or stations..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-none rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-amber-500/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Desktop Header - Hidden on Mobile */}
                <div className="hidden lg:block p-4 md:p-8 max-w-[1600px] mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm gap-4 transition-colors">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg sm:rounded-xl">
                                <Fuel className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                    Pump Management
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                                    Hardware dispensing control and station assignments.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-amber-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Quick search..."
                                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-amber-500/20 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select
                                    value={filterStation}
                                    onChange={(e) => setFilterStation(e.target.value)}
                                    className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none cursor-pointer min-w-[160px]"
                                >
                                    <option value="">All Stations</option>
                                    {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            {filterStation && (
                                <button
                                    onClick={() => setFilterStation('')}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Clear filter"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-4 lg:space-y-8">
                    {/* Desktop Stats Grid - Hidden on Mobile */}
                    <div className="hidden lg:grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Stats Cards */}
                        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest mb-1">Active Pumps</p>
                                        <h2 className="text-4xl font-black text-amber-800 dark:text-amber-200">{totalPumps}</h2>
                                        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 font-bold uppercase tracking-tighter">Hardware Registry</p>
                                    </div>
                                    <Layers className="w-8 h-8 text-amber-500/30" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest mb-1">Total Stations</p>
                                        <h2 className="text-4xl font-black text-blue-800 dark:text-blue-200">{totalStations}</h2>
                                        <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 font-bold uppercase tracking-tighter flex items-center gap-1">
                                            <Activity className="w-3 h-3" /> Linked Sites
                                        </p>
                                    </div>
                                    <Network className="w-8 h-8 text-blue-500/30" />
                                </div>
                            </div>
                        </div>

                        {/* Desktop Form */}
                        <form onSubmit={submit} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <div className="space-y-3">
                                <select
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20 p-3"
                                    value={data.station_id}
                                    onChange={e => setData('station_id', e.target.value)}
                                >
                                    <option value="">Select Station</option>
                                    {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                <input
                                    placeholder="Pump Number (e.g. P1)"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20 p-3"
                                    value={data.pump_number}
                                    onChange={e => setData('pump_number', e.target.value)}
                                />
                            </div>
                            <button
                                disabled={processing}
                                className="mt-4 w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-3 rounded-xl shadow-lg transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4 inline mr-2" />
                                Register Pump
                            </button>
                        </form>
                    </div>

                    {/* Mobile Stats Cards */}
                    <div className="grid grid-cols-2 gap-3 lg:hidden">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <Layers className="w-5 h-5 text-amber-500" />
                                <span className="text-xs text-gray-500">Pumps</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPumps}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <Building2 className="w-5 h-5 text-blue-500" />
                                <span className="text-xs text-gray-500">Stations</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStations}</p>
                        </div>
                    </div>

                    {/* Mobile Form Slide Panel */}
                    {showMobileForm && (
                        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={handleCancelEdit}>
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl p-6 animate-slide-up"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg">
                                        {editingId ? 'Edit Pump' : 'Register New Pump'}
                                    </h3>
                                    <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={submit} className="space-y-4">
                                    <div>
                                        <select
                                            className={`w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border ${errors.station_id ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700'}`}
                                            value={data.station_id}
                                            onChange={e => setData('station_id', e.target.value)}
                                        >
                                            <option value="">Select Station</option>
                                            {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                        {errors.station_id && (
                                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.station_id}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            placeholder="Pump Number (e.g. P1)"
                                            className={`w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border ${errors.pump_number ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700'}`}
                                            value={data.pump_number}
                                            onChange={e => setData('pump_number', e.target.value)}
                                        />
                                        {errors.pump_number && (
                                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.pump_number}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : editingId ? 'Update Pump' : 'Register Pump'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Mobile Pump Details Modal */}
                    {showMobileDetails && selectedPump && (
                        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setShowMobileDetails(false)}>
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl p-6 animate-slide-up"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg">Pump Details</h3>
                                    <button onClick={() => setShowMobileDetails(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-2xl font-bold text-amber-600">
                                            {selectedPump.pump_number.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold">Pump {selectedPump.pump_number}</h4>
                                            <p className="text-sm text-gray-500">ID: #{String(selectedPump.id).padStart(3, '0')}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Building2 className="w-5 h-5 text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Attached Station</p>
                                                    <p className="font-bold">{selectedPump.station.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                handleEdit(selectedPump);
                                                setShowMobileDetails(false);
                                            }}
                                            className="flex-1 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 font-bold flex items-center justify-center gap-2"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowMobileDetails(false);
                                                handleDelete(selectedPump.id);
                                            }}
                                            className="flex-1 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-rose-600 font-bold flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pump List - Mobile Optimized */}
                    <div className="lg:hidden space-y-3">
                        {filteredPumps.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                                <MousePointer2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No pumps found</p>
                                <button
                                    onClick={() => setShowMobileForm(true)}
                                    className="mt-4 text-amber-600 font-medium"
                                >
                                    Register your first pump
                                </button>
                            </div>
                        ) : (
                            filteredPumps.map((pump) => (
                                <div
                                    key={pump.id}
                                    onClick={() => handleViewDetails(pump)}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-transform cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center font-bold text-amber-600">
                                                {pump.pump_number.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">Pump {pump.pump_number}</h3>
                                                <p className="text-xs text-gray-500">#{String(pump.id).padStart(3, '0')}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                                            <Building2 className="w-4 h-4 text-blue-500" />
                                            {pump.station.name}
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-full text-xs text-green-600">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop Table - Hidden on Mobile */}
                    <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-400 border-b border-gray-100 dark:border-gray-700">
                                        <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest">ID Reference</th>
                                        <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest">Designation</th>
                                        <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest">Attached Station</th>
                                        <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredPumps.map((p) => (
                                        <tr key={p.id} className="group hover:bg-amber-50/30 dark:hover:bg-amber-900/5 transition-colors">
                                            <td className="p-4 sm:p-5">
                                                <span className="text-xs font-mono font-bold text-gray-400">#{String(p.id).padStart(3, '0')}</span>
                                            </td>
                                            <td className="p-4 sm:p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 font-black">
                                                        {p.pump_number.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-800 dark:text-white">Pump {p.pump_number}</span>
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Hardware Unit</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 sm:p-5">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <Building2 className="w-3.5 h-3.5 text-blue-500" />
                                                    <span className="text-sm font-medium">{p.station.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 sm:p-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleEdit(p)} className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg text-amber-600 transition-colors">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg text-rose-600 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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