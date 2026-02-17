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
import { Save, Truck, User, Car, ArrowLeft, CheckCircle, X, Fuel, Gauge } from 'lucide-react';
import { route } from '@/lib/route';

export default function CreateVehicle({ customers }: any) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        vehicle_number: '',
        vehicle_type: 'Truck',
        is_active: true,
        fuel_type: 'Diesel',
        registration_year: '',
        chassis_number: '',
        engine_number: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.vehicles.store'), {
            onSuccess: () => setShowSuccess(true)
        });
    };

    const vehicleTypeOptions = [
        { value: 'Truck', label: 'Truck' },
        { value: 'Tanker', label: 'Tanker' },
        { value: 'Car', label: 'Car' },
        { value: 'SUV', label: 'SUV' },
        { value: 'Bike', label: 'Bike' },
        { value: 'Bus', label: 'Bus' },
        { value: 'Other', label: 'Other' }
    ];

    const fuelTypeOptions = [
        { value: 'Diesel', label: 'Diesel' },
        { value: 'Petrol', label: 'Petrol' },
        { value: 'CNG', label: 'CNG' },
        { value: 'Electric', label: 'Electric' },
        { value: 'Hybrid', label: 'Hybrid' }
    ];

    const customerOptions = [
        { value: '', label: '-- Choose a Customer --' },
        ...customers.map((c: any) => ({
            value: c.id,
            label: `${c.name} ${c.company_name ? `(${c.company_name})` : ''}`
        }))
    ];

    const isValid = data.customer_id && data.vehicle_number;

    return (
        <AppLayout>
            <Head title="Register Vehicle" />
            
            <div className="space-y-6">
                <PageHeader 
                    title="New Vehicle" 
                    description="Assign a vehicle to an existing customer."
                    icon={<Truck className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                >
                    <Link
                        href={route('admin.vehicles.index')}
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
                            Vehicle registered successfully! Redirecting...
                        </p>
                        <button 
                            onClick={() => setShowSuccess(false)}
                            className="ml-auto p-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </button>
                    </div>
                )}

                <div className="max-w-2xl mx-auto">
                    <FormLayout onSubmit={handleSubmit}>
                        <FormCard title="Customer Assignment" icon={<User className="w-4 h-4 text-amber-600 dark:text-amber-400" />}>
                            <FormGrid cols={1}>
                                <FormSelect
                                    label="Select Customer"
                                    required
                                    icon={<User className="w-4 h-4 text-gray-400" />}
                                    value={data.customer_id}
                                    onChange={e => setData('customer_id', e.target.value)}
                                    error={errors.customer_id}
                                    options={customerOptions}
                                />
                            </FormGrid>
                        </FormCard>

                        <FormCard title="Vehicle Details" icon={<Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />}>
                            <FormGrid cols={3}>
                                <FormInput
                                    label="Vehicle Number"
                                    required
                                    icon={<Car className="w-4 h-4 text-gray-400" />}
                                    value={data.vehicle_number}
                                    onChange={e => setData('vehicle_number', e.target.value.toUpperCase())}
                                    error={errors.vehicle_number}
                                    placeholder="MH-12-AB-1234"
                                    className="uppercase"
                                />

                                <FormSelect
                                    label="Vehicle Type"
                                    icon={<Truck className="w-4 h-4 text-gray-400" />}
                                    value={data.vehicle_type}
                                    onChange={e => setData('vehicle_type', e.target.value)}
                                    options={vehicleTypeOptions}
                                />

                                <FormSelect
                                    label="Fuel Type"
                                    icon={<Fuel className="w-4 h-4 text-gray-400" />}
                                    value={data.fuel_type}
                                    onChange={e => setData('fuel_type', e.target.value)}
                                    options={fuelTypeOptions}
                                />
                            </FormGrid>

                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="relative flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input
                                                type="checkbox"
                                                id="is_active"
                                                checked={data.is_active}
                                                onChange={e => setData('is_active', e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 transition-all"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="is_active" className="font-medium text-gray-700 dark:text-gray-300">
                                                Active and Allowed for Fueling
                                            </label>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Inactive vehicles cannot be selected during sales
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FormCard>

                        <FormActions
                            processing={processing}
                            submitLabel={processing ? 'Registering...' : 'Register Vehicle'}
                            cancelUrl={route('admin.vehicles.index')}
                            cancelLabel="Cancel"
                            isValid={isValid}
                        />
                    </FormLayout>
                </div>
            </div>
        </AppLayout>
    );
}