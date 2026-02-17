import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/admin/page-header';
import FormLayout from '@/components/admin/FormLayout';
import FormCard from '@/components/admin/FormCard';
import FormGrid from '@/components/admin/FormGrid';
import FormInput from '@/components/admin/FormInput';
import FormSelect from '@/components/admin/FormSelect';
import FormActions from '@/components/admin/FormActions';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Save, ArrowLeft, Building, Phone, Mail, FileText, 
    MapPin, Truck, CheckCircle, X, RotateCcw 
} from 'lucide-react';
import { route } from '@/lib/route';

interface Props {
    party: {
        id: number;
        name: string;
        email: string | null;
        mobile: string;
        address: string | null;
        gst_number: string | null;
        type?: string;
        created_at?: string;
        updated_at?: string;
    };
}

export default function EditParty({ party }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: party.name || '',
        email: party.email || '',
        mobile: party.mobile || '',
        address: party.address || '',
        gst_number: party.gst_number || '',
        type: party.type || 'vendor'
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.parties.update', { party: party.id }), {
            onSuccess: () => setShowSuccess(true)
        });
    };

    const typeOptions = [
        { value: 'vendor', label: 'Vendor' },
        { value: 'supplier', label: 'Fuel Supplier' },
        { value: 'distributor', label: 'Distributor' },
        { value: 'other', label: 'Other' }
    ];

    const isValid = data.name && data.mobile;

    return (
        <AppLayout>
            <Head title={`Edit Party: ${party.name}`} />
            
            <div className="space-y-6">
                <PageHeader 
                    title="Edit Party" 
                    description={`Update supplier details for ${party.name}`}
                    icon={<Truck className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                >
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-mono font-bold">
                            #PRTY-{String(party.id).padStart(6, '0')}
                        </span>
                        <Link
                            href={route('admin.parties.index')}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Link>
                    </div>
                </PageHeader>

                {showSuccess && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                            Party updated successfully! Changes have been saved.
                        </p>
                        <button 
                            onClick={() => setShowSuccess(false)}
                            className="ml-auto p-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </button>
                    </div>
                )}

                {showResetConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Reset Changes</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Are you sure you want to reset all changes? This will revert to the last saved values.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowResetConfirm(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { reset(); setShowResetConfirm(false); }}
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Reset Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-3xl mx-auto">
                    <FormLayout onSubmit={handleSubmit}>
                        <FormCard title="Supplier Information" icon={<Building className="w-4 h-4 text-amber-600 dark:text-amber-400" />}>
                            <FormGrid cols={3}>
                                <div className="md:col-span-2">
                                    <FormInput
                                        label="Party/Company Name"
                                        required
                                        icon={<Building className="w-4 h-4 text-gray-400" />}
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        error={errors.name}
                                        placeholder="Enter full company name"
                                    />
                                </div>

                                <FormSelect
                                    label="Supplier Type"
                                    icon={<Truck className="w-4 h-4 text-gray-400" />}
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    options={typeOptions}
                                />

                                <FormInput
                                    label="Mobile Number"
                                    required
                                    icon={<Phone className="w-4 h-4 text-gray-400" />}
                                    type="tel"
                                    value={data.mobile}
                                    onChange={e => setData('mobile', e.target.value)}
                                    error={errors.mobile}
                                    placeholder="Primary contact number"
                                />

                                <FormInput
                                    label="Email Address"
                                    icon={<Mail className="w-4 h-4 text-gray-400" />}
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    error={errors.email}
                                    placeholder="supplier@email.com"
                                />

                                <div className="md:col-span-2">
                                    <FormInput
                                        label="GST Identification Number"
                                        icon={<FileText className="w-4 h-4 text-gray-400" />}
                                        value={data.gst_number}
                                        onChange={e => setData('gst_number', e.target.value.toUpperCase())}
                                        error={errors.gst_number}
                                        placeholder="22AAAAA0000A1Z5"
                                        className="uppercase"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <FormInput
                                        label="Full Address"
                                        icon={<MapPin className="w-4 h-4 text-gray-400" />}
                                        type="textarea"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        error={errors.address}
                                        placeholder="Enter the complete business address"
                                        rows={3}
                                    />
                                </div>
                            </FormGrid>
                        </FormCard>

                        <FormActions
                            processing={processing}
                            submitLabel={processing ? 'Saving...' : 'Update Details'}
                            cancelUrl={route('admin.parties.index')}
                            cancelLabel="Cancel"
                            isValid={isValid}
                        >
                            <button
                                type="button"
                                onClick={() => setShowResetConfirm(true)}
                                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 w-full sm:w-auto justify-center"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </button>
                        </FormActions>
                    </FormLayout>
                </div>
            </div>
        </AppLayout>
    );
}