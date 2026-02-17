import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { 
    CreditCard, ArrowUpCircle, ArrowDownCircle, 
    Landmark, Building2, Info, ChevronRight
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
    const { data, setData, post, processing, reset, errors } = useForm({
        reference_type: '',
        reference_id: '',
        party_id: '',
        customer_id: '',
        payment_type: 'CASH',
        company_bank_id: '', 
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        remarks: '',
        transaction_ref: '',
        counterparty_bank_id: '',
        bank_name: '',
        account_number: '',
        ifsc_code: '',
        account_holder_name: '',
    });

    const [outstandingList, setOutstandingList] = useState<any[]>([]);
    const [counterpartyBanks, setCounterpartyBanks] = useState<any[]>([]);

    const handlePartyChange = async (id: string) => {
        if (!id) return;
        setData(prev => ({ ...prev, party_id: id, customer_id: '', reference_type: 'PURCHASE', reference_id: '', amount: '' }));
        const res = await axios.get(route('admin.payments.fetch.party', id));
        setOutstandingList(res.data.invoices);
        setCounterpartyBanks(res.data.bank_accounts);
    };

    const handleCustomerChange = async (id: string) => {
        if (!id) return;
        setData(prev => ({ ...prev, customer_id: id, party_id: '', reference_type: 'SALE', reference_id: '', amount: '' }));
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
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Payment Management" />
            
            <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto transition-colors duration-300">
                
                {/* Stats Section - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border-l-4 border-rose-500 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                                <ArrowUpCircle className="w-8 h-8 text-rose-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Outstanding Payable</p>
                                <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white">₹{stats.total_payable.toLocaleString()}</h2>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border-l-4 border-emerald-500 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                <ArrowDownCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Outstanding Receivable</p>
                                <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white">₹{stats.total_receivable.toLocaleString()}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selectors Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <label className="text-xs font-bold uppercase text-gray-400 mb-3 block flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> Supplier Payments
                        </label>
                        <select 
                            className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-amber-500"
                            value={data.party_id}
                            onChange={(e) => handlePartyChange(e.target.value)}
                        >
                            <option value="">-- Select Party --</option>
                            {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <label className="text-xs font-bold uppercase text-gray-400 mb-3 block flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> Customer Collections
                        </label>
                        <select 
                            className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-emerald-500"
                            value={data.customer_id}
                            onChange={(e) => handleCustomerChange(e.target.value)}
                        >
                            <option value="">-- Select Customer --</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                {outstandingList.length > 0 && (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                        {/* Mobile Optimized Table/Cards */}
                        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="hidden md:block">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-400">
                                        <tr>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider">Invoice/Bill</th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider">Total</th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider">Balance</th>
                                            <th className="p-4 text-xs font-bold text-right uppercase tracking-wider">Select</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {outstandingList.map(item => (
                                            <tr key={item.id} className={`${data.reference_id === item.id ? 'bg-amber-50 dark:bg-amber-900/10' : ''} transition-colors`}>
                                                <td className="p-4">
                                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{item.bill_number || item.invoice_number}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium uppercase">{item.purchase_date || item.sale_date}</p>
                                                </td>
                                                <td className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">₹{item.total_amount}</td>
                                                <td className="p-4 text-sm font-black text-rose-500">₹{item.outstanding}</td>
                                                <td className="p-4 text-right">
                                                    <button 
                                                        onClick={() => { setData('reference_id', item.id); setData('amount', item.outstanding.toString()); }}
                                                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${data.reference_id === item.id ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                                                    >
                                                        {data.reference_id === item.id ? 'SELECTED' : 'SELECT'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Mobile List View (Hidden on Tablet/Desktop) */}
                            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
                                {outstandingList.map(item => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => { setData('reference_id', item.id); setData('amount', item.outstanding.toString()); }}
                                        className={`p-4 flex justify-between items-center ${data.reference_id === item.id ? 'bg-amber-50 dark:bg-amber-900/10' : ''}`}
                                    >
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{item.bill_number || item.invoice_number}</p>
                                            <p className="text-xs text-rose-500 font-bold">Due: ₹{item.outstanding}</p>
                                        </div>
                                        <ChevronRight className={`w-5 h-5 transition-transform ${data.reference_id === item.id ? 'text-amber-600 rotate-90' : 'text-gray-300'}`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Transaction Form - Stays fixed on scroll in desktop if needed */}
                        <form onSubmit={submit} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-amber-100 dark:border-amber-900/30 space-y-5 transition-colors">
                            <h4 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-amber-600" /> Transaction details
                            </h4>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Amount to Process</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-amber-600">₹</span>
                                    <input 
                                        type="number" 
                                        className="w-full pl-8 pr-4 py-3 rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-2xl font-black text-amber-600 focus:ring-amber-500 transition-colors"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                    />
                                </div>
                                {errors.amount && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">{errors.amount}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Method</label>
                                    <select 
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white transition-colors"
                                        value={data.payment_type}
                                        onChange={e => setData('payment_type', e.target.value)}
                                    >
                                        <option value="CASH">Cash</option>
                                        <option value="BANK">Bank Transfer</option>
                                        <option value="RTGS">RTGS/NEFT</option>
                                        <option value="CHEQUE">Cheque</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400">Payment Date</label>
                                    <input type="date" className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white transition-colors" value={data.payment_date} onChange={e => setData('payment_date', e.target.value)} />
                                </div>
                            </div>

                            {data.payment_type !== 'CASH' && (
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400">Our Sending Account</label>
                                        <select 
                                            className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white transition-colors"
                                            value={data.company_bank_id}
                                            onChange={e => setData('company_bank_id', e.target.value)}
                                        >
                                            <option value="">-- Choose Account --</option>
                                            {banks.map(b => <option key={b.id} value={b.id}>{b.bank_name} ({b.account_number.slice(-4)})</option>)}
                                        </select>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Counterparty Bank</label>
                                            <Info className="w-3 h-3 text-blue-400" />
                                        </div>

                                        <select 
                                            className="w-full rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs dark:text-white transition-colors"
                                            value={data.counterparty_bank_id}
                                            onChange={(e) => handleCounterpartyBankSelect(e.target.value)}
                                        >
                                            <option value="">-- Saved Accounts --</option>
                                            {counterpartyBanks.map(b => (
                                                <option key={b.id} value={b.id}>{b.bank_name} ({b.account_number.slice(-4)})</option>
                                            ))}
                                        </select>

                                        <input 
                                            placeholder="Bank Name"
                                            className="w-full rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs dark:text-white"
                                            value={data.bank_name}
                                            onChange={e => setData('bank_name', e.target.value)}
                                        />
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                            <input 
                                                placeholder="A/C No"
                                                className="rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs dark:text-white"
                                                value={data.account_number}
                                                onChange={e => setData('account_number', e.target.value)}
                                            />
                                            <input 
                                                placeholder="IFSC"
                                                className="rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs dark:text-white"
                                                value={data.ifsc_code}
                                                onChange={e => setData('ifsc_code', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400">Reference / UTR No.</label>
                                        <input 
                                            placeholder="Transaction Ref"
                                            className="w-full rounded-xl border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white"
                                            value={data.transaction_ref}
                                            onChange={e => setData('transaction_ref', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <button 
                                disabled={processing || !data.reference_id}
                                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-xl shadow-lg shadow-amber-600/30 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100"
                            >
                                {processing ? 'PROCESSING...' : 'COMPLETE PAYMENT'}
                            </button>
                            
                            {!data.reference_id && (
                                <p className="text-[10px] text-center text-rose-500 font-black uppercase tracking-widest animate-pulse">
                                    Please select an invoice above
                                </p>
                            )}
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}