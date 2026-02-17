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
    Save, Fuel, Gauge, IndianRupee, 
    Droplets, ArrowLeft, X, CheckCircle 
} from 'lucide-react';
import { route } from '@/lib/route';

export default function CreateProduct() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        unit: 'Liters',
        purchase_price: '',
        sale_price: '',
        category: 'fuel',
        description: '',
        min_stock_level: '',
        max_stock_level: '',
        is_active: true
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.products.store'), {
            onSuccess: () => setShowSuccess(true)
        });
    };

    const unitOptions = [
        { value: 'Liters', label: 'Liters (L)' },
        { value: 'ML', label: 'Milliliters (ml)' },
        { value: 'Pieces', label: 'Pieces (pcs)' },
        { value: 'Barrels', label: 'Barrels (bbl)' },
        { value: 'Kilograms', label: 'Kilograms (kg)' },
        { value: 'Grams', label: 'Grams (g)' }
    ];

    const categoryOptions = [
        { value: 'fuel', label: 'Fuel' },
        { value: 'lubricant', label: 'Lubricant' },
        { value: 'additive', label: 'Additive' },
        { value: 'other', label: 'Other' }
    ];

    const isValid = data.name && data.unit;

    return (
        <AppLayout>
            <Head title="Add Product" />
            
            <div className="space-y-6">
                {/* Premium Header with Icon */}
                <PageHeader 
                    title="New Product" 
                    description="Define fuel types or lubricants and set initial rates."
                    icon={<Droplets className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                >
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.products.index')}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Link>
                    </div>
                </PageHeader>

                {/* Success Message */}
                {showSuccess && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                            Product created successfully! Redirecting...
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
                        {/* Product Identity Card */}
                        <FormCard 
                            title="Product Identity" 
                            icon={<Fuel className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                        >
                            <FormGrid cols={2}>
                                <FormInput
                                    label="Product Name"
                                    required
                                    icon={<Fuel className="w-4 h-4 text-gray-400" />}
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    error={errors.name}
                                    placeholder="e.g., Petrol (Speed), Diesel, Engine Oil"
                                />
                                
                                <FormSelect
                                    label="Unit"
                                    required
                                    icon={<Gauge className="w-4 h-4 text-gray-400" />}
                                    value={data.unit}
                                    onChange={e => setData('unit', e.target.value)}
                                    error={errors.unit}
                                    options={unitOptions}
                                />
                                
                                <FormSelect
                                    label="Category"
                                    icon={<Droplets className="w-4 h-4 text-gray-400" />}
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    error={errors.category}
                                    options={categoryOptions}
                                />
                                
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                        Status
                                    </label>
                                    <div className="flex items-center gap-4 pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="is_active"
                                                value="true"
                                                checked={data.is_active === true}
                                                onChange={() => setData('is_active', true)}
                                                className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500 rounded-full"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="is_active"
                                                value="false"
                                                checked={data.is_active === false}
                                                onChange={() => setData('is_active', false)}
                                                className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500 rounded-full"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Inactive</span>
                                        </label>
                                    </div>
                                </div>
                            </FormGrid>
                        </FormCard>

                        {/* Pricing Card */}
                        <FormCard 
                            title="Opening Rates" 
                            icon={<IndianRupee className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                        >
                            <FormGrid cols={2}>
                                <FormInput
                                    label="Purchase Price (per unit)"
                                    icon={<IndianRupee className="w-4 h-4 text-gray-400" />}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.purchase_price}
                                    onChange={e => setData('purchase_price', e.target.value)}
                                    error={errors.purchase_price}
                                    placeholder="0.00"
                                />
                                
                                <FormInput
                                    label="Sale Price (per unit)"
                                    icon={<IndianRupee className="w-4 h-4 text-gray-400" />}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.sale_price}
                                    onChange={e => setData('sale_price', e.target.value)}
                                    error={errors.sale_price}
                                    placeholder="0.00"
                                />
                            </FormGrid>
                            
                            {data.purchase_price && data.sale_price && (
                                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                                            Margin per unit:
                                        </span>
                                        <span className="text-sm font-bold text-amber-800 dark:text-amber-200">
                                            ₹{(parseFloat(data.sale_price) - parseFloat(data.purchase_price)).toFixed(2)}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200 rounded-full">
                                            {data.purchase_price ? ((parseFloat(data.sale_price) - parseFloat(data.purchase_price)) / parseFloat(data.purchase_price) * 100).toFixed(1) : 0}% margin
                                        </span>
                                    </div>
                                </div>
                            )}
                        </FormCard>

                        {/* Stock Management Card (Optional) */}
                        <FormCard 
                            title="Stock Management (Optional)" 
                            icon={<Gauge className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                        >
                            <FormGrid cols={3}>
                                <FormInput
                                    label="Minimum Stock Level"
                                    type="number"
                                    min="0"
                                    value={data.min_stock_level}
                                    onChange={e => setData('min_stock_level', e.target.value)}
                                    placeholder="0"
                                />
                                
                                <FormInput
                                    label="Maximum Stock Level"
                                    type="number"
                                    min="0"
                                    value={data.max_stock_level}
                                    onChange={e => setData('max_stock_level', e.target.value)}
                                    placeholder="1000"
                                />
                            </FormGrid>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Set these values to enable low stock alerts and inventory optimization.
                            </p>
                        </FormCard>

                        {/* Description Card */}
                        <FormCard title="Description (Optional)">
                            <FormInput
                                type="textarea"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Enter product description, specifications, or additional details..."
                                rows={3}
                            />
                        </FormCard>

                        {/* Form Actions */}
                        <FormActions
                            processing={processing}
                            submitLabel="Save Product"
                            cancelUrl={route('admin.products.index')}
                            cancelLabel="Cancel"
                            isValid={isValid}
                        />
                    </FormLayout>
                </div>
            </div>
        </AppLayout>
    );
}