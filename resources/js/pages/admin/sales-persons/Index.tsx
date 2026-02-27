import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Users, Plus, Pencil, Search,
    Smartphone, Building2, Activity, ChevronRight,
    MousePointer2, ShieldCheck, MapPin, Trash2, X, Check,
    Phone, Mail, AlertCircle, Filter, UserCircle
} from 'lucide-react';
import { route } from '@/lib/route';

interface SalesPerson {
    id: number;
    name: string;
    mobile: string;
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
    salesPersons: SalesPerson[];
    stations: Station[];
}

export default function Index({ salesPersons, stations }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStation, setFilterStation] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showMobileForm, setShowMobileForm] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<SalesPerson | null>(null);
    const [showMobileDetails, setShowMobileDetails] = useState(false);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        station_id: '',
        name: '',
        mobile: ''
    });

    const totalStaff = salesPersons.length;
    const totalStations = stations.length;
    const avgPerStation = totalStations ? (totalStaff / totalStations).toFixed(1) : '0';

    const filteredStaff = salesPersons.filter(sp => {
        const matchesSearch = sp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sp.mobile.includes(searchTerm) ||
            sp.station.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStation = !filterStation || sp.station_id.toString() === filterStation;
        return matchesSearch && matchesStation;
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.sales-persons.update', editingId), {
                onSuccess: () => {
                    reset();
                    setEditingId(null);
                    setShowMobileForm(false);
                }
            });
        } else {
            post(route('admin.sales-persons.store'), {
                onSuccess: () => {
                    reset();
                    setShowMobileForm(false);
                }
            });
        }
    };

    const handleEdit = (sp: SalesPerson) => {
        setEditingId(sp.id);
        setData({
            station_id: sp.station_id.toString(),
            name: sp.name,
            mobile: sp.mobile
        });
        setShowMobileForm(true);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        reset();
        setShowMobileForm(false);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to remove this staff member?')) {
            router.delete(route('admin.sales-persons.destroy', id));
        }
    };

    const handleViewDetails = (staff: SalesPerson) => {
        setSelectedStaff(staff);
        setShowMobileDetails(true);
    };

    const formatMobile = (mobile: string) => {
        if (mobile.length === 10) {
            return `${mobile.slice(0, 5)} ${mobile.slice(5)}`;
        }
        return mobile;
    };

    return (
        <AppLayout>
            <Head title="Sales Persons" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
                {/* Mobile Header - Sticky */}
                <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 dark:text-white">Staff</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{totalStaff} members</p>
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
                                placeholder="Search by name, mobile or station..."
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
                                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                    Staff Management
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                                    Manage sales personnel and station assignments.
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
                        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest mb-1">Total Sales Team</p>
                                        <h2 className="text-4xl font-black text-amber-800 dark:text-amber-200">{totalStaff}</h2>
                                        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 font-bold uppercase">Active Members</p>
                                    </div>
                                    <ShieldCheck className="w-8 h-8 text-amber-500/30" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest mb-1">Station Coverage</p>
                                        <h2 className="text-4xl font-black text-blue-800 dark:text-blue-200">{totalStations}</h2>
                                        <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 font-bold uppercase flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> Linked Sites
                                        </p>
                                    </div>
                                    <Building2 className="w-8 h-8 text-blue-500/30" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl border border-green-100 dark:border-green-800/30 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-widest mb-1">Avg Per Station</p>
                                        <h2 className="text-4xl font-black text-green-800 dark:text-green-200">{avgPerStation}</h2>
                                        <p className="text-[10px] text-green-600 dark:text-green-400 mt-2 font-bold uppercase flex items-center gap-1">
                                            <Activity className="w-3 h-3" /> Staff Distribution
                                        </p>
                                    </div>
                                    <Users className="w-8 h-8 text-green-500/30" />
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
                                    placeholder="Full Name"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20 p-3"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                <input
                                    placeholder="Mobile Number"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20 p-3"
                                    value={data.mobile}
                                    onChange={e => setData('mobile', e.target.value)}
                                />
                            </div>
                            <button
                                disabled={processing}
                                className="mt-4 w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-3 rounded-xl shadow-lg transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4 inline mr-2" />
                                Register Staff
                            </button>
                        </form>
                    </div>

                    {/* Mobile Stats Cards */}
                    <div className="grid grid-cols-3 gap-2 lg:hidden">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                            <Users className="w-4 h-4 text-amber-500 mb-1" />
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalStaff}</p>
                            <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Staff</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                            <Building2 className="w-4 h-4 text-blue-500 mb-1" />
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalStations}</p>
                            <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Stations</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                            <Activity className="w-4 h-4 text-green-500 mb-1" />
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{avgPerStation}</p>
                            <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Avg</p>
                        </div>
                    </div>

                    {/* Mobile Form Slide Panel */}
                    {showMobileForm && (
                        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={handleCancelEdit}>
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-gray-800 pt-2">
                                    <h3 className="font-bold text-lg">
                                        {editingId ? 'Edit Staff Member' : 'Register New Staff'}
                                    </h3>
                                    <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={submit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Select Station</label>
                                        <select
                                            className={`w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border ${errors.station_id ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700'}`}
                                            value={data.station_id}
                                            onChange={e => setData('station_id', e.target.value)}
                                        >
                                            <option value="">Choose station</option>
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
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Full Name</label>
                                        <input
                                            placeholder="e.g. John Doe"
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
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Mobile Number</label>
                                        <input
                                            placeholder="e.g. 9876543210"
                                            className={`w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border ${errors.mobile ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700'}`}
                                            value={data.mobile}
                                            onChange={e => setData('mobile', e.target.value)}
                                            type="tel"
                                        />
                                        {errors.mobile && (
                                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.mobile}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : editingId ? 'Update Staff' : 'Register Staff'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Mobile Staff Details Modal */}
                    {showMobileDetails && selectedStaff && (
                        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setShowMobileDetails(false)}>
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl p-6 animate-slide-up"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg">Staff Details</h3>
                                    <button onClick={() => setShowMobileDetails(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-2xl font-bold text-amber-600">
                                            {selectedStaff.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold">{selectedStaff.name}</h4>
                                            <p className="text-sm text-gray-500">EMP#{String(selectedStaff.id).padStart(4, '0')}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-5 h-5 text-amber-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Mobile Number</p>
                                                    <p className="font-bold text-lg">{formatMobile(selectedStaff.mobile)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Building2 className="w-5 h-5 text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Assigned Station</p>
                                                    <p className="font-bold">{selectedStaff.station.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                handleEdit(selectedStaff);
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
                                                handleDelete(selectedStaff.id);
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

                    {/* Staff List - Mobile Optimized */}
                    <div className="lg:hidden space-y-3">
                        {filteredStaff.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                                <MousePointer2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No staff found</p>
                                <button
                                    onClick={() => setShowMobileForm(true)}
                                    className="mt-4 text-amber-600 font-medium"
                                >
                                    Register your first staff member
                                </button>
                            </div>
                        ) : (
                            filteredStaff.map((staff) => (
                                <div
                                    key={staff.id}
                                    onClick={() => handleViewDetails(staff)}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-transform cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center font-bold text-amber-600">
                                                {staff.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{staff.name}</h3>
                                                <p className="text-xs text-gray-500">EMP#{String(staff.id).padStart(4, '0')}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                            <Phone className="w-3 h-3 text-amber-500" />
                                            <span>{staff.mobile}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                            <MapPin className="w-3 h-3 text-blue-500" />
                                            <span>{staff.station.name}</span>
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
                                        <th className="p-5 text-[10px] font-black uppercase tracking-widest">Personnel Profile</th>
                                        <th className="p-5 text-[10px] font-black uppercase tracking-widest">Mobile Contact</th>
                                        <th className="p-5 text-[10px] font-black uppercase tracking-widest">Assigned Location</th>
                                        <th className="p-5 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredStaff.map((sp) => (
                                        <tr key={sp.id} className="group hover:bg-amber-50/30 dark:hover:bg-amber-900/5 transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 font-black">
                                                        {sp.name.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-800 dark:text-white">{sp.name}</span>
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">EMP#{String(sp.id).padStart(4, '0')}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2 font-mono text-sm text-gray-600 dark:text-gray-300">
                                                    <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                                                    {sp.mobile}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{sp.station.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleEdit(sp)} className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg text-amber-600 transition-colors">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(sp.id)} className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg text-rose-600 transition-colors">
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