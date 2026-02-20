import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Landmark, Plus, Pencil, Trash2, X } from 'lucide-react';
import { route } from '@/lib/route';

interface Bank {
    id: number;
    bank_name: string;
    bank_type: string;
    account_number: string;
    ifsc_code: string;
    account_holder_name: string;
    branch?: string;
}

export default function BankIndex({ banks }: { banks: Bank[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        bank_name: '',
        bank_type: 'CURRENT',
        account_number: '',
        ifsc_code: '',
        account_holder_name: '',
        branch: '',
    });

    const openCreateModal = () => {
        reset();
        setEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (bank: Bank) => {
        setData({
            bank_name: bank.bank_name,
            bank_type: bank.bank_type || 'CURRENT',
            account_number: bank.account_number,
            ifsc_code: bank.ifsc_code,
            account_holder_name: bank.account_holder_name,
            branch: bank.branch || '',
        });
        setSelectedId(bank.id);
        setEditMode(true);
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMode && selectedId) {
            put(route('admin.banks.update', selectedId), { onSuccess: () => setIsModalOpen(false) });
        } else {
            post(route('admin.banks.store'), { onSuccess: () => setIsModalOpen(false) });
        }
    };

    return (
        <AppLayout>
            <Head title="Company Banks" />
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Company Bank Accounts</h2>
                        <p className="text-sm text-gray-500">Manage your own accounts for payments</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl font-bold transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add New Bank
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banks.map(bank => (
                        <div key={bank.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative group">
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                                    <Landmark className="w-6 h-6 text-amber-600" />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(bank)} className="p-2 text-gray-400 hover:text-blue-500"><Pencil className="w-4 h-4" /></button>
                                    <button onClick={() => { if (confirm('Delete this account?')) destroy(route('admin.banks.destroy', bank.id)) }} className="p-2 text-gray-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg dark:text-white">{bank.bank_name}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bank.bank_type === 'SAVING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                                            bank.bank_type === 'OD' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                                                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                        }`}>{bank.bank_type || 'CURRENT'}</span>
                                </div>
                                <p className="text-sm text-gray-500">{bank.account_holder_name}</p>
                                <div className="mt-3 space-y-1">
                                    <div className="flex justify-between text-xs"><span className="text-gray-400">A/C No:</span> <span className="font-mono font-bold dark:text-gray-200">{bank.account_number}</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-gray-400">IFSC:</span> <span className="font-mono dark:text-gray-200">{bank.ifsc_code}</span></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal Overlay */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="font-bold text-lg">{editMode ? 'Edit Bank Account' : 'Add Bank Account'}</h3>
                                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <form onSubmit={submit} className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400">Bank Name</label>
                                    <input className="w-full rounded-xl border-gray-200 dark:bg-gray-700" value={data.bank_name} onChange={e => setData('bank_name', e.target.value)} />
                                    {errors.bank_name && <p className="text-rose-500 text-xs mt-1">{errors.bank_name}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400">A/C Holder Name</label>
                                    <input className="w-full rounded-xl border-gray-200 dark:bg-gray-700 dark:text-white" value={data.account_holder_name} onChange={e => setData('account_holder_name', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400">Bank Type</label>
                                    <select className="w-full rounded-xl border-gray-200 dark:bg-gray-700 dark:text-white" value={data.bank_type} onChange={e => setData('bank_type', e.target.value)}>
                                        <option value="SAVING">Saving</option>
                                        <option value="CURRENT">Current</option>
                                        <option value="OD">OD (Overdraft)</option>
                                    </select>
                                    {errors.bank_type && <p className="text-rose-500 text-xs mt-1">{errors.bank_type}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400">Account Number</label>
                                    <input className="w-full rounded-xl border-gray-200 dark:bg-gray-700 font-mono" value={data.account_number} onChange={e => setData('account_number', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-400">IFSC Code</label>
                                        <input className="w-full rounded-xl border-gray-200 dark:bg-gray-700" value={data.ifsc_code} onChange={e => setData('ifsc_code', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-400">Branch</label>
                                        <input className="w-full rounded-xl border-gray-200 dark:bg-gray-700" value={data.branch} onChange={e => setData('branch', e.target.value)} />
                                    </div>
                                </div>
                                <button
                                    disabled={processing}
                                    className="w-full bg-amber-600 py-3 rounded-xl text-white font-bold hover:bg-amber-500 transition-all mt-4"
                                >
                                    {processing ? 'Saving...' : (editMode ? 'Update Account' : 'Save Account')}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}