import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/admin/page-header';
import FormLayout from '@/components/admin/FormLayout';
import FormCard from '@/components/admin/FormCard';
import FormGrid from '@/components/admin/FormGrid';
import FormInput from '@/components/admin/FormInput';
import FormActions from '@/components/admin/FormActions';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Building2, Phone, Mail, FileText, MapPin, Users, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { route } from '@/lib/route';

export default function CreateCustomer() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        company_name: '',
        mobile: '',
        email: '',
        address: '',
        gst_number: '',
        type: 'individual'
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.customers.store'), {
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
            <Head title="Create Customer" />
            
            <div className="space-y-6">
                <PageHeader 
                    title="Add New Customer" 
                    description="Register a new individual or corporate customer to the system."
                    icon={<Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                >
                    <Link
                        href={route('admin.customers.index')}
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
                            Customer created successfully! Redirecting...
                        </p>
                        <button 
                            onClick={() => setShowSuccess(false)}
                            className="ml-auto p-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </button>
                    </div>
                )}

                <div className="max-w-4xl mx-auto">
                    <FormLayout onSubmit={handleSubmit}>
                        <FormCard title="Basic Information" icon={<User className="w-4 h-4 text-amber-600 dark:text-amber-400" />}>
                            <FormGrid cols={2}>
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
                            <FormGrid cols={3}>
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

                        <FormActions
                            processing={processing}
                            submitLabel={processing ? 'Saving...' : 'Save Customer'}
                            cancelUrl={route('admin.customers.index')}
                            cancelLabel="Back to List"
                            isValid={isValid}
                        />
                    </FormLayout>
                </div>
            </div>
        </AppLayout>
    );
}