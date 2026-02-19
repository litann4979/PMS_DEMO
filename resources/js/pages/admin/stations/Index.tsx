import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Plus, Pencil, Search, Building2,
    MapPin, Fuel, ChevronRight,
    MousePointer2, Network, Activity,
    Globe2, Trash2, X, Check, Menu,
    AlertCircle, Filter
} from 'lucide-react';
import { route } from '@/lib/route';

interface Station {
    id: number;
    name: string;
    location: string;
    pumps_count: number;
}

interface Props {
    stations: Station[];
}

export default function Index({ stations }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [selectedStation, setSelectedStation] = useState<Station | null>(null);
    const [showMobileDetails, setShowMobileDetails] = useState(false);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: '',
        location: ''
    });

    const totalStations = stations.length;
    const totalPumpsAcrossAll = stations.reduce((sum, s) => sum + (s.pumps_count || 0), 0);

    const filteredStations = stations.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            put(route('admin.stations.update', editingId), {
                onSuccess: () => {
                    reset();
                    setEditingId(null);
                    setShowMobileFilters(false);
                }
            });
        } else {
            post(route('admin.stations.store'), {
                onSuccess: () => {
                    reset();
                    setShowMobileFilters(false);
                }
            });
        }
    };

    const handleEdit = (station: Station) => {
        setEditingId(station.id);
        setData({
            name: station.name,
            location: station.location
        });
        setShowMobileFilters(true);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        reset();
        setShowMobileFilters(false);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this station?')) {
            router.delete(route('admin.stations.destroy', id));
        }
    };

    const handleViewDetails = (station: Station) => {
        setSelectedStation(station);
        setShowMobileDetails(true);
    };

    return (
        <AppLayout>
            <Head title="Station Management" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
                {/* Mobile Header - Sticky */}
                <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 dark:text-white">Stations</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{totalStations} total</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600"
                        >
                            {showMobileFilters ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Mobile Search */}
                    <div className="px-4 pb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search stations..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-none rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-amber-500/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Desktop Header - Hidden on Mobile */}
                <div className="hidden lg:block p-4 md:p-8 max-w-[1600px] mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg sm:rounded-xl">
                                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                    Station Network
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                                    Manage operational fuel stations and geographical locations.
                                </p>
                            </div>
                        </div>
                        <div className="relative group w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-amber-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Quick search..."
                                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-amber-500/20 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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
                                        <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest mb-1">Operational Sites</p>
                                        <h2 className="text-4xl font-black text-amber-800 dark:text-amber-200">{totalStations}</h2>
                                        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 font-bold uppercase tracking-tighter">Registered Stations</p>
                                    </div>
                                    <Globe2 className="w-8 h-8 text-amber-500/30" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest mb-1">Total Pump Units</p>
                                        <h2 className="text-4xl font-black text-blue-800 dark:text-blue-200">{totalPumpsAcrossAll}</h2>
                                        <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 font-bold uppercase tracking-tighter flex items-center gap-1">
                                            <Activity className="w-3 h-3" /> Hardware Network
                                        </p>
                                    </div>
                                    <Network className="w-8 h-8 text-blue-500/30" />
                                </div>
                            </div>
                        </div>
                        
                        {/* Desktop Form */}
                        <form onSubmit={submit} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <div className="space-y-3">
                                <input
                                    placeholder="Station Name"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20 p-3"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                <input
                                    placeholder="City/Region Location"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20 p-3"
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                />
                            </div>
                            <button
                                disabled={processing}
                                className="mt-4 w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-3 rounded-xl shadow-lg transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4 inline mr-2" />
                                Add Station
                            </button>
                        </form>
                    </div>

                    {/* Mobile Stats Cards */}
                    <div className="grid grid-cols-2 gap-3 lg:hidden">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <Globe2 className="w-5 h-5 text-amber-500" />
                                <span className="text-xs text-gray-500">Sites</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStations}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <Network className="w-5 h-5 text-blue-500" />
                                <span className="text-xs text-gray-500">Pumps</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPumpsAcrossAll}</p>
                        </div>
                    </div>

                    {/* Mobile Form Slide Panel */}
                    {showMobileFilters && (
                        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={handleCancelEdit}>
                            <div 
                                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl p-6 animate-slide-up"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg">
                                        {editingId ? 'Edit Station' : 'Add New Station'}
                                    </h3>
                                    <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <form onSubmit={submit} className="space-y-4">
                                    <div>
                                        <input
                                            placeholder="Station Name"
                                            className={`w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border ${errors.name ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700'}`}
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            placeholder="Location"
                                            className={`w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border ${errors.location ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700'}`}
                                            value={data.location}
                                            onChange={e => setData('location', e.target.value)}
                                        />
                                        {errors.location && (
                                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.location}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : editingId ? 'Update Station' : 'Add Station'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Mobile Station Details Modal */}
                    {showMobileDetails && selectedStation && (
                        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setShowMobileDetails(false)}>
                            <div 
                                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl p-6 animate-slide-up"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg">Station Details</h3>
                                    <button onClick={() => setShowMobileDetails(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-2xl font-bold text-amber-600">
                                            {selectedStation.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold">{selectedStation.name}</h4>
                                            <p className="text-sm text-gray-500">ID: #{String(selectedStation.id).padStart(4, '0')}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                            <MapPin className="w-5 h-5 text-rose-500 mb-2" />
                                            <p className="text-xs text-gray-500">Location</p>
                                            <p className="font-bold">{selectedStation.location}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                            <Fuel className="w-5 h-5 text-blue-500 mb-2" />
                                            <p className="text-xs text-gray-500">Pumps</p>
                                            <p className="font-bold">{selectedStation.pumps_count}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                handleEdit(selectedStation);
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
                                                handleDelete(selectedStation.id);
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

                    {/* Station List - Mobile Optimized */}
                    <div className="lg:hidden space-y-3">
                        {filteredStations.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                                <MousePointer2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No stations found</p>
                                <button
                                    onClick={() => setShowMobileFilters(true)}
                                    className="mt-4 text-amber-600 font-medium"
                                >
                                    Add your first station
                                </button>
                            </div>
                        ) : (
                            filteredStations.map((station) => (
                                <div
                                    key={station.id}
                                    onClick={() => handleViewDetails(station)}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-transform cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center font-bold text-amber-600">
                                                {station.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{station.name}</h3>
                                                <p className="text-xs text-gray-500">#{String(station.id).padStart(4, '0')}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                                            <MapPin className="w-4 h-4 text-rose-500" />
                                            {station.location}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                                            <Fuel className="w-4 h-4 text-blue-500" />
                                            {station.pumps_count} pumps
                                        </div>
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
                                        <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest">Station Profile</th>
                                        <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest">Geographical Data</th>
                                        <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest text-center">Unit Capacity</th>
                                        <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredStations.map((s) => (
                                        <tr key={s.id} className="group hover:bg-amber-50/30 dark:hover:bg-amber-900/5 transition-colors">
                                            <td className="p-4 sm:p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 font-black">
                                                        {s.name.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-800 dark:text-white">{s.name}</span>
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">UID: #{String(s.id).padStart(4, '0')}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 sm:p-5">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                                    <span className="text-sm font-medium">{s.location}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 sm:p-5 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full text-xs font-black text-blue-600 uppercase tracking-tighter">
                                                    <Fuel className="w-3 h-3" /> {s.pumps_count} Pumps
                                                </span>
                                            </td>
                                            <td className="p-4 sm:p-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(s)}
                                                        className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg text-amber-600 transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(s.id)}
                                                        className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg text-rose-600 transition-colors"
                                                    >
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