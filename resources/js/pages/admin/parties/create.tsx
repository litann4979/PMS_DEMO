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
import { Building, User, Mail, Phone, FileText, MapPin, Truck, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { route } from '@/lib/route';

export default function CreateParty() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        mobile: '',
        address: '',
        gst_number: '',
        type: 'vendor'
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.parties.store'), {
            onSuccess: () => setShowSuccess(true)
        });
    };

    const typeOptions = [
        { value: 'vendor', label: 'Vendor' },
        { value: 'supplier', label: 'Fuel Supplier' },
        { value: 'distributor', label: 'Distributor' },
        { value: 'other', label: 'Other' }
    ];

    return (
        <AppLayout>
            <Head title="Add New Party" />
            
            <div className="space-y-6">
                <PageHeader 
                    title="Create Party" 
                    description="Register a new vendor or fuel supplier."
                    icon={<Truck className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                >
                    <Link
                        href={route('admin.parties.index')}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                </PageHeader>

                {showSuccess && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                            Party created successfully! Redirecting...
                        </p>
                        <button 
                            onClick={() => setShowSuccess(false)}
                            className="ml-auto p-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </button>
                    </div>
                )}

                <div className="max-w-3xl mx-auto">
                    <FormLayout onSubmit={handleSubmit}>
                        <FormCard title="Supplier Information" icon={<Building className="w-4 h-4 text-amber-600 dark:text-amber-400" />}>
                            <FormGrid cols={3}>
                                <FormInput
                                    label="Party/Company Name"
                                    required
                                    icon={<Building className="w-4 h-4 text-gray-400" />}
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    error={errors.name}
                                    placeholder="Enter full company name"
                                />

                                <FormSelect
                                    label="Supplier Type"
                                    icon={<User className="w-4 h-4 text-gray-400" />}
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
                                    placeholder="vendor@email.com"
                                />

                                <div className="md:col-span-2">
                                    <FormInput
                                        label="GST Number"
                                        icon={<FileText className="w-4 h-4 text-gray-400" />}
                                        value={data.gst_number}
                                        onChange={e => setData('gst_number', e.target.value.toUpperCase())}
                                        error={errors.gst_number}
                                        placeholder="GSTIN (22 characters)"
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
                                        placeholder="Full business address"
                                        rows={3}
                                    />
                                </div>
                            </FormGrid>
                        </FormCard>

                        <FormActions
                            processing={processing}
                            submitLabel={processing ? 'Saving...' : 'Create Party'}
                            cancelUrl={route('admin.parties.index')}
                            cancelLabel="Cancel"
                            isValid={!!data.name && !!data.mobile}
                        />
                    </FormLayout>
                </div>
            </div>
        </AppLayout>
    );
}