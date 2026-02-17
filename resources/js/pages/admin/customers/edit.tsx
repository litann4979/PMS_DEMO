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
    Save, RotateCcw, User, Building2, Phone, Mail, 
    MapPin, FileText, Users, ArrowLeft, CheckCircle, X, Car 
} from 'lucide-react';
import { route } from '@/lib/route';

interface Props {
    customer: {
        id: number;
        name: string;
        company_name: string | null;
        mobile: string;
        email: string | null;
        address: string | null;
        gst_number: string | null;
        type?: string;
        vehicles_count?: number;
        created_at?: string;
        updated_at?: string;
    };
}

export default function EditCustomer({ customer }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: customer.name || '',
        company_name: customer.company_name || '',
        mobile: customer.mobile || '',
        email: customer.email || '',
        address: customer.address || '',
        gst_number: customer.gst_number || '',
        type: customer.type || 'individual'
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.customers.update', { customer: customer.id }), {
            onSuccess: () => setShowSuccess(true)
        });
    };

    const customerTypeOptions = [
        { value: 'individual', label: 'Individual' },
        { value: 'corporate', label: 'Corporate' },
        { value: 'government', label: 'Government' },
        { value: 'fleet', label: 'Fleet Operator' }
    ];

    const isValid = data.name && data.mobile;

    return (
        <AppLayout>
            <Head title={`Edit ${customer.name}`} />
            
            <div className="space-y-6">
                <PageHeader 
                    title="Edit Customer" 
                    description={`Update information for ${customer.name}`}
                    icon={<Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                >
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-mono font-bold">
                            #CUST-{String(customer.id).padStart(6, '0')}
                        </span>
                        <Link
                            href={route('admin.customers.index')}
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
                            Customer updated successfully! Changes have been saved.
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

                <div className="max-w-4xl mx-auto">
                    <FormLayout onSubmit={handleSubmit}>
                        <FormCard title="Basic Information" icon={<User className="w-4 h-4 text-amber-600 dark:text-amber-400" />}>
                            <FormGrid cols={3}>
                                <FormInput
                                    label="Customer Name"
                                    required
                                    icon={<User className="w-4 h-4 text-gray-400" />}
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    error={errors.name}
                                    placeholder="Full Name"
                                />

                                <FormInput
                                    label="Company Name (Optional)"
                                    icon={<Building2 className="w-4 h-4 text-gray-400" />}
                                    value={data.company_name}
                                    onChange={e => setData('company_name', e.target.value)}
                                    error={errors.company_name}
                                    placeholder="e.g. Acme Corp"
                                />

                                <FormSelect
                                    label="Customer Type"
                                    icon={<Users className="w-4 h-4 text-gray-400" />}
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    options={customerTypeOptions}
                                />

                                <FormInput
                                    label="Mobile Number"
                                    required
                                    icon={<Phone className="w-4 h-4 text-gray-400" />}
                                    type="tel"
                                    value={data.mobile}
                                    onChange={e => setData('mobile', e.target.value)}
                                    error={errors.mobile}
                                    placeholder="+91 XXXXX XXXXX"
                                />

                                <FormInput
                                    label="Email Address"
                                    icon={<Mail className="w-4 h-4 text-gray-400" />}
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    error={errors.email}
                                    placeholder="customer@example.com"
                                />
                            </FormGrid>
                        </FormCard>

                        <FormCard title="Tax & Billing" icon={<FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />}>
                            <FormGrid cols={2}>
                                <div className="md:col-span-2">
                                    <FormInput
                                        label="GST Number"
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
                                        label="Address"
                                        icon={<MapPin className="w-4 h-4 text-gray-400" />}
                                        type="textarea"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        error={errors.address}
                                        placeholder="Complete street address..."
                                        rows={3}
                                    />
                                </div>
                            </FormGrid>
                        </FormCard>

                        {/* Customer Summary Card */}
                        {customer.vehicles_count !== undefined && (
                            <FormCard title="Customer Summary" icon={<Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />}>
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                                        <Car className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Registered Vehicles</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{customer.vehicles_count}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Link
                                            href={route('admin.vehicles.index', { customer_id: customer.id })}
                                            className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium inline-flex items-center gap-1"
                                        >
                                            View Vehicles
                                            <ArrowLeft className="w-3 h-3 rotate-180" />
                                        </Link>
                                    </div>
                                </div>
                            </FormCard>
                        )}

                        <FormActions
                            processing={processing}
                            submitLabel={processing ? 'Updating...' : 'Update Customer'}
                            cancelUrl={route('admin.customers.index')}
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