import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Plus, Pencil, Search, Fuel,
    Gauge, Activity, ChevronRight,
    MousePointer2, Layers, Zap, Trash2, X, Check, Droplets,
    Building2, AlertCircle, Filter
} from 'lucide-react';
import { route } from '@/lib/route';

interface Nozzle {
    id: number;
    nozzle_number: string;
    current_meter_reading: string;
    pump_id: number;
    product_id: number;
    pump: { pump_number: string };
    product: { name: string };
}

interface Pump {
    id: number;
    pump_number: string;
}

interface Product {
    id: number;
    name: string;
}

interface Props {
    nozzles: Nozzle[];
    pumps: Pump[];
    products: Product[];
}

export default function Index({ nozzles, pumps, products }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showMobileForm, setShowMobileForm] = useState(false);
    const [selectedNozzle, setSelectedNozzle] = useState<Nozzle | null>(null);
    const [showMobileDetails, setShowMobileDetails] = useState(false);

    const { data, setData, post, put, reset, processing, errors } = useForm({
        pump_id: '',
        product_id: '',
        nozzle_number: ''
    });

    const totalNozzles = nozzles.length;
    const totalPumps = pumps.length;
    const totalProducts = products.length;
    const avgReading = nozzles.length
        ? (nozzles.reduce((sum, n) => sum + parseFloat(n.current_meter_reading || '0'), 0) / nozzles.length).toFixed(2)
        : '0.00';

    const filteredNozzles = nozzles.filter(n =>
        n.nozzle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.pump.pump_number.toString().includes(searchTerm)
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.nozzles.update', editingId), {
                onSuccess: () => {
                    reset();
                    setEditingId(null);
                    setShowMobileForm(false);
                }
            });
        } else {
            post(route('admin.nozzles.store'), {
                onSuccess: () => {
                    reset();
                    setShowMobileForm(false);
                }
            });
        }
    };

    const handleEdit = (nozzle: Nozzle) => {
        setEditingId(nozzle.id);
        setData({
            pump_id: nozzle.pump_id.toString(),
            product_id: nozzle.product_id.toString(),
            nozzle_number: nozzle.nozzle_number
        });
        setShowMobileForm(true);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        reset();
        setShowMobileForm(false);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this nozzle?')) {
            router.delete(route('admin.nozzles.destroy', id));
        }
    };

    const handleViewDetails = (nozzle: Nozzle) => {
        setSelectedNozzle(nozzle);
        setShowMobileDetails(true);
    };

    const getProductColor = (productName: string) => {
        const name = productName.toLowerCase();
        if (name.includes('petrol') || name.includes('gasoline')) return 'amber';
        if (name.includes('diesel')) return 'blue';
        if (name.includes('premium')) return 'purple';
        return 'gray';
    };

    return (
        <AppLayout>
            <Head title="Nozzle Management" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
                {/* Mobile Header - Sticky */}
                <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 dark:text-white">Nozzles</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{totalNozzles} active</p>
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
                                placeholder="Search nozzles, pumps or products..."
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
                                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                    Nozzle Network
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                                    Manage hardware dispensing units and meter flow data.
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
                        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest mb-1">Active Nozzles</p>
                                        <h2 className="text-4xl font-black text-amber-800 dark:text-amber-200">{totalNozzles}</h2>
                                        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 font-bold uppercase tracking-tighter">Hardware Registry</p>
                                    </div>
                                    <Droplets className="w-8 h-8 text-amber-500/30" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest mb-1">Total Pumps</p>
                                        <h2 className="text-4xl font-black text-blue-800 dark:text-blue-200">{totalPumps}</h2>
                                        <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 font-bold uppercase tracking-tighter">Connected Units</p>
                                    </div>
                                    <Layers className="w-8 h-8 text-blue-500/30" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/30 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest mb-1">Avg Flow Reading</p>
                                        <h2 className="text-4xl font-black text-purple-800 dark:text-purple-200">{avgReading}</h2>
                                        <p className="text-[10px] text-purple-600 dark:text-purple-400 mt-2 font-bold uppercase tracking-tighter flex items-center gap-1">
                                            <Activity className="w-3 h-3" /> Cumulative Vol.
                                        </p>
                                    </div>
                                    <Gauge className="w-8 h-8 text-purple-500/30" />
                                </div>
                            </div>
                        </div>

                        {/* Desktop Form */}
                        <form onSubmit={submit} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <div className="space-y-3">
                                <select
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20 p-3"
                                    value={data.pump_id}
                                    onChange={e => setData('pump_id', e.target.value)}
                                >
                                    <option value="">Select Pump</option>
                                    {pumps.map(p => <option key={p.id} value={p.id}>Pump #{p.pump_number}</option>)}
                                </select>
                                <select
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20 p-3"
                                    value={data.product_id}
                                    onChange={e => setData('product_id', e.target.value)}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(pr => <option key={pr.id} value={pr.id}>{pr.name}</option>)}
                                </select>
                                <input
                                    placeholder="Nozzle ID Number"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20 p-3"
                                    value={data.nozzle_number}
                                    onChange={e => setData('nozzle_number', e.target.value)}
                                />
                            </div>
                            <button
                                disabled={processing}
                                className="mt-4 w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-3 rounded-xl shadow-lg transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4 inline mr-2" />
                                Register Nozzle
                            </button>
                        </form>
                    </div>

                    {/* Mobile Stats Cards */}
                    <div className="grid grid-cols-3 gap-2 lg:hidden">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                            <Droplets className="w-4 h-4 text-amber-500 mb-1" />
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalNozzles}</p>
                            <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Nozzles</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                            <Layers className="w-4 h-4 text-blue-500 mb-1" />
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalPumps}</p>
                            <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Pumps</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                            <Gauge className="w-4 h-4 text-purple-500 mb-1" />
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{avgReading}</p>
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
                                        {editingId ? 'Edit Nozzle' : 'Register New Nozzle'}
                                    </h3>
                                    <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={submit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Select Pump</label>
                                        <select
                                            className={`w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border ${errors.pump_id ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700'}`}
                                            value={data.pump_id}
                                            onChange={e => setData('pump_id', e.target.value)}
                                        >
                                            <option value="">Choose pump</option>
                                            {pumps.map(p => <option key={p.id} value={p.id}>Pump #{p.pump_number}</option>)}
                                        </select>
                                        {errors.pump_id && (
                                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.pump_id}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Select Product</label>
                                        <select
                                            className={`w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border ${errors.product_id ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700'}`}
                                            value={data.product_id}
                                            onChange={e => setData('product_id', e.target.value)}
                                        >
                                            <option value="">Choose product</option>
                                            {products.map(pr => <option key={pr.id} value={pr.id}>{pr.name}</option>)}
                                        </select>
                                        {errors.product_id && (
                                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.product_id}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Nozzle Number</label>
                                        <input
                                            placeholder="e.g. NZ-001"
                                            className={`w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border ${errors.nozzle_number ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700'}`}
                                            value={data.nozzle_number}
                                            onChange={e => setData('nozzle_number', e.target.value)}
                                        />
                                        {errors.nozzle_number && (
                                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.nozzle_number}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : editingId ? 'Update Nozzle' : 'Register Nozzle'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Mobile Nozzle Details Modal */}
                    {showMobileDetails && selectedNozzle && (
                        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setShowMobileDetails(false)}>
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl p-6 animate-slide-up"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg">Nozzle Details</h3>
                                    <button onClick={() => setShowMobileDetails(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-2xl font-bold text-amber-600">
                                            {selectedNozzle.nozzle_number.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold">Nozzle {selectedNozzle.nozzle_number}</h4>
                                            <p className="text-sm text-gray-500">ID: #{String(selectedNozzle.id).padStart(3, '0')}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                            <Layers className="w-5 h-5 text-blue-500 mb-2" />
                                            <p className="text-xs text-gray-500">Pump</p>
                                            <p className="font-bold">#{selectedNozzle.pump.pump_number}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                            <Fuel className="w-5 h-5 text-green-500 mb-2" />
                                            <p className="text-xs text-gray-500">Product</p>
                                            <p className="font-bold">{selectedNozzle.product.name}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500">Current Meter Reading</p>
                                                <p className="text-2xl font-bold text-amber-600">{selectedNozzle.current_meter_reading}</p>
                                            </div>
                                            <Gauge className="w-8 h-8 text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                handleEdit(selectedNozzle);
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
                                                handleDelete(selectedNozzle.id);
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

                    {/* Nozzle List - Mobile Optimized */}
                    <div className="lg:hidden space-y-3">
                        {filteredNozzles.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                                <MousePointer2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No nozzles found</p>
                                <button
                                    onClick={() => setShowMobileForm(true)}
                                    className="mt-4 text-amber-600 font-medium"
                                >
                                    Register your first nozzle
                                </button>
                            </div>
                        ) : (
                            filteredNozzles.map((nozzle) => {
                                const color = getProductColor(nozzle.product.name);
                                return (
                                    <div
                                        key={nozzle.id}
                                        onClick={() => handleViewDetails(nozzle)}
                                        className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-transform cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center font-bold text-amber-600">
                                                    {nozzle.nozzle_number.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white">Nozzle {nozzle.nozzle_number}</h3>
                                                    <p className="text-xs text-gray-500">#{String(nozzle.id).padStart(3, '0')}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                                <Layers className="w-3 h-3 text-blue-500" />
                                                <span>Pump #{nozzle.pump.pump_number}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                                <div className={`w-2 h-2 rounded-full bg-${color}-500`} />
                                                <span>{nozzle.product.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                                <Gauge className="w-3 h-3 text-purple-500" />
                                                <span>{nozzle.current_meter_reading}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Desktop Table - Hidden on Mobile */}
                    <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-400 border-b border-gray-100 dark:border-gray-700">
                                        <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest">Dispensing Unit</th>
                                        <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest text-center">Pump Link</th>
                                        <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest">Product Type</th>
                                        <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredNozzles.map((n) => {
                                        const color = getProductColor(n.product.name);
                                        return (
                                            <tr key={n.id} className="group hover:bg-amber-50/30 dark:hover:bg-amber-900/5 transition-colors">
                                                <td className="p-4 sm:p-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 font-black">
                                                            {n.nozzle_number.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-800 dark:text-white">Nozzle {n.nozzle_number}</span>
                                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter font-mono">Current Meter: {n.current_meter_reading}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 sm:p-5 text-center">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                                                        <Layers className="w-3 h-3" /> Pump #{n.pump.pump_number}
                                                    </span>
                                                </td>
                                                <td className="p-4 sm:p-5">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-bold uppercase tracking-tight">
                                                        <div className={`h-2 w-2 rounded-full bg-${color}-500`} />
                                                        {n.product.name}
                                                    </div>
                                                </td>
                                                <td className="p-4 sm:p-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleEdit(n)} className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg text-amber-600 transition-colors">
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(n.id)} className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg text-rose-600 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
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