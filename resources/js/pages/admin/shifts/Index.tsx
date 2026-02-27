import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    Clock, Plus, Pencil, Search,
    Gauge, Activity, ChevronRight,
    MousePointer2, PlayCircle, StopCircle,
    Zap, Timer, UserCircle2, X, CheckCircle2,
    AlertCircle, Users, Fuel, DollarSign, Calendar
} from 'lucide-react';
import { route } from '@/lib/route';

interface Shift {
    id: number;
    sales_person_id: number;
    nozzle_id: number;
    sales_person: { name: string };
    nozzle: { nozzle_number: string };
    start_meter: string;
    end_meter: string | null;
    total_quantity: string | null;
    total_amount: string | null;
    created_at?: string;
}

interface Props {
    shifts: Shift[];
    salesPersons: any[];
    nozzles: any[];
    openingCash: number;
}

export default function Index({ shifts, salesPersons, nozzles, openingCash }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStaff, setFilterStaff] = useState('');
    const [filterNozzle, setFilterNozzle] = useState('');
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [showMobileForm, setShowMobileForm] = useState(false);
    const [selectedShiftDetails, setSelectedShiftDetails] = useState<Shift | null>(null);
    const [showMobileDetails, setShowMobileDetails] = useState(false);
    // Inside your Index component
    const [showEODModal, setShowEODModal] = useState(false);
    const denominations = [500, 200, 100, 50, 20, 10, 5, 2, 1];

    const eodForm = useForm({
        shift_type: 'DAY',   // 👈 default value
        breakdown: denominations.map(d => ({ denomination: d, count: 0 }))
    });

    const calculateEODTotal = () => {
        return eodForm.data.breakdown.reduce((sum, item) => sum + (item.denomination * item.count), 0);
    };

    const handleEODSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        eodForm.post(route('admin.day-closing.store'), {
            onSuccess: () => {
                setShowEODModal(false);
                eodForm.reset();
            }
        });
    };

    const startForm = useForm({
        sales_person_id: '',
        nozzle_id: '',
        start_meter: ''
    });


    const endForm = useForm({
        shift_id: '',
        end_meter: ''
    });

    const activeShiftsCount = shifts.filter(s => !s.end_meter).length;
    const completedShiftsCount = shifts.filter(s => s.end_meter).length;
    const totalVolume = shifts.reduce((sum, s) => sum + parseFloat(s.total_quantity || '0'), 0).toFixed(2);
    const totalRevenue = shifts.reduce((sum, s) => sum + parseFloat(s.total_amount || '0'), 0).toFixed(2);

    const filteredShifts = shifts.filter(s => {
        const matchesSearch = s.sales_person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.nozzle.nozzle_number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStaff = !filterStaff || s.sales_person_id.toString() === filterStaff;
        const matchesNozzle = !filterNozzle || s.nozzle_id.toString() === filterNozzle;
        return matchesSearch && matchesStaff && matchesNozzle;
    });

    const handleStartShift = (e: React.FormEvent) => {
        e.preventDefault();
        startForm.post(route('admin.shifts.start'), {
            onSuccess: () => {
                startForm.reset();
                setShowMobileForm(false);
            }
        });
    };

    const handleOpenEndModal = (shift: Shift) => {
        setSelectedShift(shift);
        endForm.setData({
            shift_id: shift.id.toString(),
            end_meter: ''
        });
    };

    const handleEndShift = (e: React.FormEvent) => {
        e.preventDefault();
        endForm.post(route('admin.shifts.end'), {
            onSuccess: () => {
                setSelectedShift(null);
                endForm.reset();
            }
        });
    };

    const handleViewDetails = (shift: Shift) => {
        setSelectedShiftDetails(shift);
        setShowMobileDetails(true);
    };

    const previewQuantity = (selectedShift && endForm.data.end_meter)
        ? (parseFloat(endForm.data.end_meter) - parseFloat(selectedShift.start_meter)).toFixed(2)
        : "0.00";

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    return (
        <AppLayout>
            <Head title="Shift Management" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
                {/* Mobile Header - Sticky */}
                <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
                    <div className="flex items-center justify-between p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h1 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Shifts</h1>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{activeShiftsCount} active</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowEODModal(true)}
                                className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
                            >
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                onClick={() => setShowMobileForm(!showMobileForm)}
                                className="p-1.5 sm:p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600"
                            >
                                {showMobileForm ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by staff or nozzle..."
                                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-700 border-none rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-amber-500/20"
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
                                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                    Shift Operations
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                                    Monitor active dispensing sessions and reconcile meter readings.
                                </p>
                                <button
                                    onClick={() => setShowEODModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    End of Day
                                </button>
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
                                <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select
                                    value={filterStaff}
                                    onChange={(e) => setFilterStaff(e.target.value)}
                                    className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none cursor-pointer min-w-[150px]"
                                >
                                    <option value="">All Staff</option>
                                    {salesPersons.map(sp => <option key={sp.id} value={sp.id}>{sp.name}</option>)}
                                </select>
                            </div>
                            <div className="relative">
                                <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select
                                    value={filterNozzle}
                                    onChange={(e) => setFilterNozzle(e.target.value)}
                                    className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none cursor-pointer min-w-[150px]"
                                >
                                    <option value="">All Nozzles</option>
                                    {nozzles.map(n => <option key={n.id} value={n.id}>Nozzle #{n.nozzle_number}</option>)}
                                </select>
                            </div>
                            {(filterStaff || filterNozzle) && (
                                <button
                                    onClick={() => { setFilterStaff(''); setFilterNozzle(''); }}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Clear filters"
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
                            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-amber-100 text-xs font-black uppercase tracking-widest mb-1">Live Sessions</p>
                                        <h2 className="text-5xl font-black">{activeShiftsCount}</h2>
                                    </div>
                                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                        <Timer className="w-8 h-8" />
                                    </div>
                                </div>
                                <p className="text-xs text-amber-100 font-bold mt-4 flex items-center gap-2">
                                    <Activity className="w-3 h-3 animate-pulse" /> Personnel on duty
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest mb-1">Total Volume</p>
                                        <h2 className="text-4xl font-black text-blue-800 dark:text-blue-200">{totalVolume}</h2>
                                        <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 font-bold uppercase flex items-center gap-1">
                                            <Fuel className="w-3 h-3" /> Liters Dispensed
                                        </p>
                                    </div>
                                    <Zap className="w-8 h-8 text-blue-500/30" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl border border-green-100 dark:border-green-800/30 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-widest mb-1">Total Revenue</p>
                                        <h2 className="text-4xl font-black text-green-800 dark:text-green-200">₹{parseFloat(totalRevenue).toLocaleString()}</h2>
                                        <p className="text-[10px] text-green-600 dark:text-green-400 mt-2 font-bold uppercase flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" /> Sales Value
                                        </p>
                                    </div>
                                    <Activity className="w-8 h-8 text-green-500/30" />
                                </div>
                            </div>
                        </div>

                        {/* Desktop Quick Start Form */}
                        <form onSubmit={handleStartShift} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-4">
                                <PlayCircle className="w-4 h-4 text-amber-500" />
                                <h4 className="font-black text-gray-800 dark:text-white uppercase text-xs tracking-tighter">Start New Shift</h4>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <select
                                        className={`w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20 p-3 ${startForm.errors.sales_person_id ? 'ring-2 ring-rose-500' : ''}`}
                                        value={startForm.data.sales_person_id}
                                        onChange={e => startForm.setData('sales_person_id', e.target.value)}
                                    >
                                        <option value="">Select Staff</option>
                                        {salesPersons.map(sp => <option key={sp.id} value={sp.id}>{sp.name}</option>)}
                                    </select>
                                    {startForm.errors.sales_person_id && (
                                        <p className="text-rose-500 text-[10px] font-bold mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {startForm.errors.sales_person_id}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <select
                                        className={`w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20 p-3 ${startForm.errors.nozzle_id ? 'ring-2 ring-rose-500' : ''}`}
                                        value={startForm.data.nozzle_id}
                                        onChange={e => startForm.setData('nozzle_id', e.target.value)}
                                    >
                                        <option value="">Select Nozzle</option>
                                        {nozzles.map(n => <option key={n.id} value={n.id}>Nozzle #{n.nozzle_number}</option>)}
                                    </select>
                                    {startForm.errors.nozzle_id && (
                                        <p className="text-rose-500 text-[10px] font-bold mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {startForm.errors.nozzle_id}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Start Meter (Optional)"
                                        className={`w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20 p-3 ${startForm.errors.start_meter ? 'ring-2 ring-rose-500' : ''}`}
                                        value={startForm.data.start_meter || ''}
                                        onChange={e => startForm.setData('start_meter', e.target.value)}
                                    />
                                    {startForm.errors.start_meter && (
                                        <p className="text-rose-500 text-[10px] font-bold mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {startForm.errors.start_meter}
                                        </p>
                                    )}
                                </div>
                                <button
                                    disabled={startForm.processing}
                                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-3 rounded-xl shadow-lg transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                                >
                                    {startForm.processing ? 'Starting...' : 'Start Shift'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Mobile Stats Cards */}
                    <div className="grid grid-cols-2 gap-3 lg:hidden">
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white">
                            <Timer className="w-5 h-5 mb-2 opacity-90" />
                            <p className="text-xs opacity-90">Live Sessions</p>
                            <p className="text-2xl font-bold">{activeShiftsCount}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <Fuel className="w-5 h-5 text-blue-500 mb-2" />
                            <p className="text-xs text-gray-500">Volume</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalVolume} L</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <DollarSign className="w-5 h-5 text-green-500 mb-2" />
                            <p className="text-xs text-gray-500">Revenue</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">₹{parseFloat(totalRevenue).toLocaleString()}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
                            <p className="text-xs text-gray-500">Completed</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{completedShiftsCount}</p>
                        </div>
                    </div>

                    {/* Mobile Start Shift Form Panel */}
                    {showMobileForm && (
                        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setShowMobileForm(false)}>
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl p-6 animate-slide-up"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg">Start New Shift</h3>
                                    <button onClick={() => setShowMobileForm(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleStartShift} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Select Staff</label>
                                        <select
                                            className={`w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border ${startForm.errors.sales_person_id ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700'}`}
                                            value={startForm.data.sales_person_id}
                                            onChange={e => startForm.setData('sales_person_id', e.target.value)}
                                        >
                                            <option value="">Choose staff member</option>
                                            {salesPersons.map(sp => <option key={sp.id} value={sp.id}>{sp.name}</option>)}
                                        </select>
                                        {startForm.errors.sales_person_id && (
                                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {startForm.errors.sales_person_id}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Select Nozzle</label>
                                        <select
                                            className={`w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border ${startForm.errors.nozzle_id ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700'}`}
                                            value={startForm.data.nozzle_id}
                                            onChange={e => startForm.setData('nozzle_id', e.target.value)}
                                        >
                                            <option value="">Choose nozzle</option>
                                            {nozzles.map(n => <option key={n.id} value={n.id}>Nozzle #{n.nozzle_number}</option>)}
                                        </select>
                                        {startForm.errors.nozzle_id && (
                                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {startForm.errors.nozzle_id}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Start Meter (Optional)"
                                            className={`w-full bg-gray-50 dark:bg-gray-900 rounded-xl text-xs font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20 p-3 border ${startForm.errors.start_meter ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700'}`}
                                            value={startForm.data.start_meter || ''}
                                            onChange={e => startForm.setData('start_meter', e.target.value)}
                                        />
                                        {startForm.errors.start_meter && (
                                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {startForm.errors.start_meter}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={startForm.processing}
                                        className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl disabled:opacity-50"
                                    >
                                        {startForm.processing ? 'Starting...' : 'Start Shift'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Mobile Shift Details Modal */}
                    {showMobileDetails && selectedShiftDetails && (
                        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setShowMobileDetails(false)}>
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl p-6 animate-slide-up"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg">Shift Details</h3>
                                    <button onClick={() => setShowMobileDetails(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-2xl font-bold text-amber-600">
                                            {selectedShiftDetails.sales_person.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold">{selectedShiftDetails.sales_person.name}</h4>
                                            <p className="text-sm text-gray-500">Shift #{selectedShiftDetails.id}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                            <Fuel className="w-5 h-5 text-blue-500 mb-2" />
                                            <p className="text-xs text-gray-500">Nozzle</p>
                                            <p className="font-bold text-lg">#{selectedShiftDetails.nozzle.nozzle_number}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                            <Activity className="w-5 h-5 text-amber-500 mb-2" />
                                            <p className="text-xs text-gray-500">Status</p>
                                            <p className={`font-bold ${selectedShiftDetails.end_meter ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {selectedShiftDetails.end_meter ? 'Completed' : 'Active'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                            <span className="text-sm text-gray-500">Start Meter</span>
                                            <span className="font-mono font-bold">{selectedShiftDetails.start_meter} L</span>
                                        </div>
                                        <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                            <span className="text-sm text-gray-500">End Meter</span>
                                            <span className="font-mono font-bold">{selectedShiftDetails.end_meter || '—'}</span>
                                        </div>
                                        {selectedShiftDetails.total_quantity && (
                                            <div className="flex justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                                <span className="text-sm text-emerald-600">Quantity</span>
                                                <span className="font-bold text-emerald-600">{selectedShiftDetails.total_quantity} L</span>
                                            </div>
                                        )}
                                        {selectedShiftDetails.total_amount && (
                                            <div className="flex justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                                <span className="text-sm text-green-600">Amount</span>
                                                <span className="font-bold text-green-600">₹{parseFloat(selectedShiftDetails.total_amount).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {!selectedShiftDetails.end_meter && (
                                        <button
                                            onClick={() => {
                                                setShowMobileDetails(false);
                                                handleOpenEndModal(selectedShiftDetails);
                                            }}
                                            className="w-full p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-rose-600 font-bold flex items-center justify-center gap-2"
                                        >
                                            <StopCircle className="w-4 h-4" />
                                            End Shift
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shift List - Mobile Optimized */}
                    <div className="lg:hidden space-y-3">
                        {filteredShifts.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                                <MousePointer2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No shifts found</p>
                                <button
                                    onClick={() => setShowMobileForm(true)}
                                    className="mt-4 text-amber-600 font-medium"
                                >
                                    Start a new shift
                                </button>
                            </div>
                        ) : (
                            filteredShifts.map((shift) => (
                                <div
                                    key={shift.id}
                                    onClick={() => handleViewDetails(shift)}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-transform cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center font-bold text-amber-600">
                                                {shift.sales_person.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{shift.sales_person.name}</h3>
                                                <p className="text-xs text-gray-500">Shift #{shift.id}</p>
                                            </div>
                                        </div>
                                        {shift.end_meter ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full text-[10px] font-bold text-amber-600">
                                                ACTIVE
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                            <Fuel className="w-3 h-3 text-blue-500" />
                                            <span>Nozzle #{shift.nozzle.nozzle_number}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                            <Gauge className="w-3 h-3 text-amber-500" />
                                            <span>Start: {shift.start_meter}</span>
                                        </div>
                                        {shift.total_quantity && (
                                            <div className="flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                                                <Activity className="w-3 h-3 text-emerald-600" />
                                                <span>{shift.total_quantity} L</span>
                                            </div>
                                        )}
                                    </div>

                                    {shift.total_amount && (
                                        <div className="mt-2 text-xs text-gray-500">
                                            Amount: <span className="font-bold text-green-600">₹{parseFloat(shift.total_amount).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop Table - Hidden on Mobile */}
                    <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-400 border-b border-gray-100 dark:border-gray-700 font-black uppercase text-[10px] tracking-widest">
                                        <th className="p-5">Operator</th>
                                        <th className="p-5">Nozzle</th>
                                        <th className="p-5 text-center">Meter Details</th>
                                        <th className="p-5">Session Total</th>
                                        <th className="p-5 text-right">Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredShifts.map((shift) => (
                                        <tr key={shift.id} className="group hover:bg-amber-50/30 dark:hover:bg-amber-900/5 transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:text-amber-500 transition-colors">
                                                        <UserCircle2 className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-800 dark:text-white">{shift.sales_person.name}</span>
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">ID: #{shift.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className="inline-flex items-center px-3 py-1 bg-amber-50 dark:bg-amber-900/30 rounded-full text-[10px] font-black text-amber-600 uppercase">
                                                    Nozzle {shift.nozzle.nozzle_number}
                                                </span>
                                            </td>
                                            <td className="p-5 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-600 dark:text-gray-300">
                                                        <span>{shift.start_meter}</span>
                                                        <ChevronRight className="w-3 h-3 text-gray-300" />
                                                        <span className={shift.end_meter ? '' : 'text-amber-500 animate-pulse'}>
                                                            {shift.end_meter || 'OPEN'}
                                                        </span>
                                                    </div>
                                                    <span className="text-[8px] text-gray-400 font-bold uppercase mt-1">Start → End Meter</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-emerald-600">
                                                        {shift.total_amount ? `₹${parseFloat(shift.total_amount).toLocaleString()}` : '-'}
                                                    </span>
                                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">
                                                        {shift.total_quantity ? `${shift.total_quantity} Ltrs` : 'Active'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-right">
                                                {shift.end_meter ? (
                                                    <CheckCircle2 className="inline w-6 h-6 text-emerald-500" />
                                                ) : (
                                                    <button
                                                        onClick={() => handleOpenEndModal(shift)}
                                                        className="px-4 py-2 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-sm active:scale-95"
                                                    >
                                                        End Shift
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* End Shift Modal - Responsive */}
                {selectedShift && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
                        <form onSubmit={handleEndShift} className="bg-white dark:bg-gray-800 w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl lg:rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                            <div className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-base sm:text-lg font-black text-gray-800 dark:text-white uppercase tracking-tighter">Reconcile Shift</h3>
                                    <button type="button" onClick={() => setSelectedShift(null)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors">
                                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>

                                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-100 dark:border-amber-800/30">
                                    <p className="text-[10px] font-black text-amber-700 dark:text-amber-300 uppercase mb-1.5 tracking-widest">Shift Summary</p>
                                    <div className="space-y-0.5">
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                            Operator: <span className="font-bold text-gray-800 dark:text-white">{selectedShift.sales_person.name}</span>
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                            Opening: <span className="font-mono font-bold text-gray-800 dark:text-white">{selectedShift.start_meter} L</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Final Meter Reading</label>
                                    <input
                                        autoFocus
                                        type="number"
                                        step="0.01"
                                        required
                                        className={`w-full text-2xl sm:text-3xl font-black text-amber-600 bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-4 focus:ring-amber-500/10 ${endForm.errors.end_meter ? 'ring-2 ring-rose-500' : ''}`}
                                        placeholder="000.00"
                                        value={endForm.data.end_meter}
                                        onChange={e => endForm.setData('end_meter', e.target.value)}
                                    />

                                    {endForm.data.end_meter && (
                                        <div className="flex justify-between px-1 pt-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Sales Quantity:</span>
                                            <span className={`text-[10px] font-black ${parseFloat(previewQuantity) < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                {previewQuantity} Liters
                                            </span>
                                        </div>
                                    )}

                                    {endForm.errors.end_meter && (
                                        <p className="text-rose-500 text-[10px] font-bold uppercase ml-1 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {endForm.errors.end_meter}
                                        </p>
                                    )}
                                </div>

                                <button
                                    disabled={endForm.processing}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 sm:py-4 rounded-xl shadow-xl shadow-emerald-600/20 transition-all active:scale-[0.98] uppercase text-xs tracking-widest disabled:opacity-50"
                                >
                                    {endForm.processing ? 'Finalizing...' : 'Complete & Finalize'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {showEODModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
                        <form onSubmit={handleEODSubmit} className="bg-white dark:bg-gray-800 w-full sm:max-w-sm lg:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
                            <div className="p-4 sm:p-5 lg:p-6 max-h-[90vh] overflow-y-auto">
                                {/* Drag handle for mobile */}
                                <div className="flex justify-center mb-3 sm:hidden">
                                    <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                </div>
                                <div className="flex justify-between items-center mb-4 sm:mb-5">
                                    <h3 className="text-base sm:text-lg font-black uppercase tracking-tighter dark:text-white">Day Closing</h3>
                                    <button type="button" onClick={() => setShowEODModal(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400">
                                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                                <div className="mb-3 sm:mb-4">
                                    <label className="text-[10px] sm:text-xs font-black uppercase text-gray-500 block mb-1.5">
                                        Select Shift
                                    </label>
                                    <select
                                        value={eodForm.data.shift_type}
                                        onChange={(e) => eodForm.setData('shift_type', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 sm:p-3 text-sm font-bold dark:text-white focus:ring-2 focus:ring-amber-500/20"
                                    >
                                        <option value="DAY">DAY SHIFT (7AM - 9PM)</option>
                                        <option value="NIGHT">NIGHT SHIFT (9PM - 7AM)</option>
                                    </select>
                                    {eodForm.errors.shift_type && (
                                        <p className="text-rose-500 text-xs mt-1">{eodForm.errors.shift_type}</p>
                                    )}
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] sm:text-xs font-black uppercase text-blue-600">Opening Cash</span>
                                        <span className="text-lg sm:text-xl font-black text-blue-700 dark:text-blue-400">₹{openingCash.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    {eodForm.data.breakdown.map((item, index) => (
                                        <div key={item.denomination} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-2 sm:p-2.5 rounded-xl">
                                            <span className="w-9 sm:w-10 text-xs sm:text-sm font-bold text-gray-400">₹{item.denomination}</span>
                                            <input
                                                type="number"
                                                className="w-full bg-transparent border-none focus:ring-0 font-bold p-0 text-sm dark:text-white"
                                                placeholder="0"
                                                value={item.count || ''}
                                                onChange={e => {
                                                    const newBreakdown = [...eodForm.data.breakdown];
                                                    newBreakdown[index].count = parseInt(e.target.value) || 0;
                                                    eodForm.setData('breakdown', newBreakdown);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] sm:text-xs font-black uppercase text-amber-600">Total Cash Handover</span>
                                        <span className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400">₹{calculateEODTotal().toLocaleString()}</span>
                                    </div>
                                </div>
                                <button
                                    disabled={eodForm.processing}
                                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-3 sm:py-4 rounded-xl uppercase text-xs tracking-widest disabled:opacity-50"
                                >
                                    {eodForm.processing ? 'Saving...' : 'Confirm Day Closing'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
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