import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    CreditCard, ArrowUpCircle, ArrowDownCircle,
    Landmark, Building2, Info, ChevronRight,
    Search, Wallet, Receipt, Droplets, TrendingUp,
    AlertCircle, X, CheckCircle2, Users, Calendar,
    Banknote, Clock
} from 'lucide-react';
import { route } from '@/lib/route';
import axios from 'axios';

interface Props {
    parties: any[];
    customers: any[];
    banks: any[];
    stats: { total_payable: number; total_receivable: number };
}

export default function PaymentIndex({ parties, customers, banks, stats }: Props) {
    const [activeTab, setActiveTab] = useState<'payable' | 'receivable'>('payable');
    const [showMobileForm, setShowMobileForm] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [showMobileDetails, setShowMobileDetails] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        payable_type: '',
        payable_id: '',
        party_id: '',
        customer_id: '',
        payment_type: 'CASH',
        company_bank_id: '',
        paid_amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        remarks: '',
        transaction_reference_id: '',
        counterparty_bank_id: '',
        bank_name: '',
        bank_type: 'CURRENT',
        account_number: '',
        ifsc_code: '',
        account_holder_name: '',
    });

    const [outstandingList, setOutstandingList] = useState<any[]>([]);
    const [counterpartyBanks, setCounterpartyBanks] = useState<any[]>([]);

    useEffect(() => {
        setOutstandingList([]);
        setCounterpartyBanks([]);
        reset();
    }, [activeTab]);

    const handlePartyChange = async (id: string) => {
        if (!id) return;
        setData(prev => ({
            ...prev,
            party_id: id,
            customer_id: '',
            payable_type: 'PURCHASE',
            payable_id: '',
            paid_amount: ''
        }));
        const res = await axios.get(route('admin.payments.fetch.party', id));
        setOutstandingList(res.data.invoices);
        setCounterpartyBanks(res.data.bank_accounts);
    };

    const handleCustomerChange = async (id: string) => {
        if (!id) return;
        setData(prev => ({
            ...prev,
            customer_id: id,
            party_id: '',
            payable_type: 'SALE',
            payable_id: '',
            paid_amount: ''
        }));
        const res = await axios.get(route('admin.payments.fetch.customer', id));
        setOutstandingList(res.data.invoices);
        setCounterpartyBanks(res.data.bank_accounts);
    };

    const handleCounterpartyBankSelect = (bankId: string) => {
        const bank = counterpartyBanks.find(b => b.id.toString() === bankId);
        setData(prev => ({
            ...prev,
            counterparty_bank_id: bankId,
            bank_name: bank?.bank_name || '',
            bank_type: bank?.bank_type || 'CURRENT',
            account_number: bank?.account_number || '',
            ifsc_code: bank?.ifsc_code || '',
            account_holder_name: bank?.account_holder_name || '',
        }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.payments.store'), {
            onSuccess: () => {
                reset();
                setOutstandingList([]);
                setShowMobileForm(false);
                setShowMobileDetails(false);
            }
        });
    };

    const handleSelectInvoice = (invoice: any) => {
        setData('payable_id', invoice.id);
        setData('paid_amount', invoice.outstanding.toString());
        setSelectedInvoice(invoice);
        setShowMobileDetails(true);
    };

    const formatCurrency = (paid_amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(paid_amount);
    };

    return (
        <AppLayout>
            <Head title="Payment Management" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
                {/* Mobile Header - Sticky */}
                <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <Wallet className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-900 dark:text-white">Payments</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {activeTab === 'payable' ? 'Supplier Dues' : 'Customer Collections'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Tabs */}
                    <div className="flex gap-2 px-4 pb-4">
                        <button
                            onClick={() => setActiveTab('payable')}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === 'payable'
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}
                        >
                            <ArrowUpCircle className="w-4 h-4 inline mr-1" />
                            Payable
                        </button>
                        <button
                            onClick={() => setActiveTab('receivable')}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === 'receivable'
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}
                        >
                            <ArrowDownCircle className="w-4 h-4 inline mr-1" />
                            Receivable
                        </button>
                    </div>
                </div>

                {/* Desktop Header - Hidden on Mobile */}
                <div className="hidden lg:block p-4 md:p-8 max-w-[1600px] mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg sm:rounded-xl">
                                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                    Financial Management
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                                    Settle supplier dues and manage customer collection entries.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-4 lg:space-y-8">
                    {/* Desktop Stats Cards - Hidden on Mobile */}
                    <div className="hidden lg:grid grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/10 dark:to-orange-900/10 rounded-xl border border-rose-100 dark:border-rose-800/30 p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-widest mb-1">Total Payable</p>
                                    <h2 className="text-3xl font-black text-rose-800 dark:text-rose-200">
                                        ₹{stats.total_payable.toLocaleString()}
                                    </h2>
                                    <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-2 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3 rotate-180" /> Supplier Liabilities
                                    </p>
                                </div>
                                <ArrowUpCircle className="w-10 h-10 text-rose-500/30" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/30 p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest mb-1">Total Receivable</p>
                                    <h2 className="text-3xl font-black text-emerald-800 dark:text-emerald-200">
                                        ₹{stats.total_receivable.toLocaleString()}
                                    </h2>
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> Customer Receivables
                                    </p>
                                </div>
                                <ArrowDownCircle className="w-10 h-10 text-emerald-500/30" />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Stats Cards */}
                    <div className="grid grid-cols-2 gap-3 lg:hidden">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <ArrowUpCircle className="w-5 h-5 text-rose-500" />
                                <span className="text-xs text-gray-500">Payable</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">₹{stats.total_payable.toLocaleString()}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <ArrowDownCircle className="w-5 h-5 text-emerald-500" />
                                <span className="text-xs text-gray-500">Receivable</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">₹{stats.total_receivable.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {/* Desktop Tabs - Hidden on Mobile */}
                        <div className="hidden lg:flex border-b border-gray-100 dark:border-gray-700 p-2 bg-gray-50/50 dark:bg-gray-900/20">
                            <button
                                onClick={() => setActiveTab('payable')}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'payable'
                                    ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-sm border border-gray-100 dark:border-gray-600'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                    }`}
                            >
                                <Wallet className="w-5 h-5" /> Supplier Payments
                            </button>
                            <button
                                onClick={() => setActiveTab('receivable')}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'receivable'
                                    ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm border border-gray-100 dark:border-gray-600'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                    }`}
                            >
                                <Receipt className="w-5 h-5" /> Customer Collections
                            </button>
                        </div>

                        <div className="p-4 lg:p-8">
                            {/* Selector Section */}
                            <div className="mb-6 lg:mb-8">
                                <h3 className="text-base lg:text-lg font-bold text-gray-800 dark:text-white mb-3 lg:mb-4">
                                    {activeTab === 'payable' ? 'Select Supplier' : 'Select Customer'}
                                </h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                                    <select
                                        className={`w-full pl-10 pr-4 py-3 lg:py-4 rounded-xl lg:rounded-2xl border-2 appearance-none bg-gray-50 dark:bg-gray-900 dark:text-white text-sm ${activeTab === 'payable'
                                            ? 'border-amber-100 focus:border-amber-500 focus:ring-amber-500/20'
                                            : 'border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500/20'
                                            }`}
                                        value={activeTab === 'payable' ? data.party_id : data.customer_id}
                                        onChange={(e) => activeTab === 'payable' ? handlePartyChange(e.target.value) : handleCustomerChange(e.target.value)}
                                    >
                                        <option value="">-- Choose {activeTab === 'payable' ? 'Party' : 'Customer'} --</option>
                                        {(activeTab === 'payable' ? parties : customers).map(item => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {outstandingList.length > 0 ? (
                                <>
                                    {/* Mobile Invoice List */}
                                    <div className="lg:hidden space-y-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Pending Invoices</p>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${activeTab === 'payable' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>
                                                {outstandingList.length}
                                            </span>
                                        </div>
                                        {outstandingList.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => handleSelectInvoice(item)}
                                                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-transform cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`p-2 rounded-lg ${activeTab === 'payable' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'}`}>
                                                            <Receipt className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm dark:text-white">#{item.bill_number || item.invoice_number}</p>
                                                            <p className="text-[10px] text-gray-500">{item.purchase_date || item.sale_date}</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                                    <span className="text-xs text-gray-500">Outstanding</span>
                                                    <span className="font-bold text-rose-500">₹{item.outstanding}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop Invoice Grid */}
                                    <div className="hidden lg:grid grid-cols-12 gap-6">
                                        {/* Left Side - Invoice List */}
                                        <div className="col-span-7 space-y-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Available Invoices</p>
                                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${activeTab === 'payable' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>
                                                    {outstandingList.length} Pending
                                                </span>
                                            </div>
                                            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
                                                {outstandingList.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => {
                                                            setData('payable_id', item.id);
                                                            setData('paid_amount', item.outstanding.toString());
                                                        }}
                                                        className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${data.payable_id === item.id
                                                            ? (activeTab === 'payable' ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-900/20' : 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20')
                                                            : 'border-gray-50 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`p-3 rounded-xl ${data.payable_id === item.id
                                                                    ? (activeTab === 'payable' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white')
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                                                    }`}>
                                                                    <Receipt className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold dark:text-white">#{item.bill_number || item.invoice_number}</p>
                                                                    <p className="text-xs text-gray-400">{item.purchase_date || item.sale_date}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-black text-rose-500">₹{item.outstanding}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right Side - Payment Form */}
                                        <div className="col-span-5">
                                            <PaymentForm
                                                activeTab={activeTab}
                                                data={data}
                                                setData={setData}
                                                errors={errors}
                                                processing={processing}
                                                submit={submit}
                                                banks={banks}
                                                counterpartyBanks={counterpartyBanks}
                                                handleCounterpartyBankSelect={handleCounterpartyBankSelect}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 lg:py-16 text-center">
                                    <div className="h-16 w-16 lg:h-20 lg:w-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-4">
                                        <Building2 className="w-8 h-8 lg:w-10 lg:h-10 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <h5 className="text-sm lg:text-base font-bold text-gray-500 dark:text-gray-400 mb-1">No Invoices Selected</h5>
                                    <p className="text-xs text-gray-400 max-w-xs mx-auto">
                                        Select a {activeTab === 'payable' ? 'supplier' : 'customer'} above to view pending invoices
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Invoice Details Modal */}
                {showMobileDetails && selectedInvoice && (
                    <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setShowMobileDetails(false)}>
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-gray-800 pt-2">
                                <h3 className="font-bold text-lg">Process Payment</h3>
                                <button onClick={() => setShowMobileDetails(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`p-2 rounded-lg ${activeTab === 'payable' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            <Receipt className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold">#{selectedInvoice.bill_number || selectedInvoice.invoice_number}</p>
                                            <p className="text-xs text-gray-500">{selectedInvoice.purchase_date || selectedInvoice.sale_date}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-sm text-gray-500">Outstanding Amount</span>
                                        <span className="text-xl font-bold text-rose-500">₹{selectedInvoice.outstanding}</span>
                                    </div>
                                </div>
                            </div>

                            <PaymentForm
                                activeTab={activeTab}
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                submit={submit}
                                banks={banks}
                                counterpartyBanks={counterpartyBanks}
                                handleCounterpartyBankSelect={handleCounterpartyBankSelect}
                                isMobile={true}
                            />
                        </div>
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

// Extracted Payment Form Component
function PaymentForm({
    activeTab,
    data,
    setData,
    errors,
    processing,
    submit,
    banks,
    counterpartyBanks,
    handleCounterpartyBankSelect,
    isMobile = false
}: any) {
    return (
        <form onSubmit={submit} className={`bg-gray-50 dark:bg-gray-900/30 p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4 lg:space-y-5`}>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Amount</label>
                <div className="relative">
                    <input
                        type="number"
                        className={`w-full text-xl lg:text-2xl font-black bg-white dark:bg-gray-800 border-none rounded-xl px-4 py-3 focus:ring-4 ${activeTab === 'payable' ? 'text-amber-600 focus:ring-amber-500/10' : 'text-emerald-600 focus:ring-emerald-500/10'}`}
                        value={data.paid_amount}
                        onChange={e => setData('paid_amount', e.target.value)}
                        placeholder="0.00"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg lg:text-xl font-black text-gray-300">₹</span>
                </div>
                {errors.paid_amount && (
                    <p className="text-rose-500 text-[10px] font-bold ml-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.paid_amount}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Method</label>
                    <select
                        className="w-full bg-white dark:bg-gray-800 border-none rounded-xl text-xs font-bold dark:text-white py-3 px-3"
                        value={data.payment_type}
                        onChange={e => setData('payment_type', e.target.value)}
                    >
                        <option value="CASH">Cash</option>
                        <option value="BANK">Bank</option>
                        <option value="RTGS">RTGS/NEFT</option>
                        <option value="CHEQUE">Cheque</option>
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Date</label>
                    <input
                        type="date"
                        className="w-full bg-white dark:bg-gray-800 border-none rounded-xl text-xs font-bold dark:text-white py-3 px-3"
                        value={data.payment_date}
                        onChange={e => setData('payment_date', e.target.value)}
                    />
                </div>
            </div>

            {data.payment_type !== 'CASH' && (
                <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Source Bank</label>
                        <select
                            className="w-full bg-white dark:bg-gray-800 border-none rounded-xl text-xs font-bold dark:text-white py-3 px-3"
                            value={data.company_bank_id}
                            onChange={e => setData('company_bank_id', e.target.value)}
                        >
                            <option value="">Select Account</option>
                            {banks.map((b: any) => (
                                <option key={b.id} value={b.id}>{b.bank_name} [{b.bank_type || 'CURRENT'}] (••••{b.account_number.slice(-4)})</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl space-y-3">
                        <label className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-1">
                            <Landmark className="w-3 h-3" /> Counterparty Bank
                        </label>
                        <select
                            className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg text-xs font-bold dark:text-white py-2"
                            value={data.counterparty_bank_id}
                            onChange={(e) => handleCounterpartyBankSelect(e.target.value)}
                        >
                            <option value="">Saved Accounts</option>
                            {counterpartyBanks.map((b: any) => (
                                <option key={b.id} value={b.id}>{b.bank_name} [{b.bank_type || 'CURRENT'}] (••••{b.account_number.slice(-4)})</option>
                            ))}
                        </select>
                        <select
                            className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg text-xs font-bold dark:text-white py-2"
                            value={data.bank_type}
                            onChange={e => setData('bank_type', e.target.value)}
                        >
                            <option value="SAVING">Saving</option>
                            <option value="CURRENT">Current</option>
                            <option value="OD">OD (Overdraft)</option>
                        </select>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                placeholder="A/C No"
                                className="bg-gray-50 dark:bg-gray-900 border-none rounded-lg text-xs font-bold dark:text-white py-2 px-2"
                                value={data.account_number}
                                onChange={e => setData('account_number', e.target.value)}
                            />
                            <input
                                placeholder="IFSC"
                                className="bg-gray-50 dark:bg-gray-900 border-none rounded-lg text-xs font-bold dark:text-white py-2 px-2"
                                value={data.ifsc_code}
                                onChange={e => setData('ifsc_code', e.target.value)}
                            />
                        </div>
                        <input
                            placeholder="Transaction Reference"
                            className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg text-xs font-bold dark:text-white py-2 px-2"
                            value={data.transaction_reference_id}
                            onChange={e => setData('transaction_reference_id', e.target.value)}
                        />
                    </div>
                </div>
            )}

            <button
                disabled={processing || !data.payable_id}
                className={`w-full py-4 rounded-xl text-white font-bold text-sm tracking-widest shadow-lg transition-all active:scale-[0.97] disabled:opacity-50 ${activeTab === 'payable'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-500'
                    }`}
            >
                {processing ? 'Processing...' : (activeTab === 'payable' ? 'Pay Now' : 'Collect Payment')}
            </button>

            {!data.payable_id && (
                <div className="flex items-center justify-center gap-1 text-amber-500">
                    <Info className="w-3 h-3" />
                    <p className="text-[9px] font-bold">Select an invoice first</p>
                </div>
            )}
        </form>
    );
}