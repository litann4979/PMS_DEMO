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
    Save, RotateCcw, IndianRupee, Fuel, Gauge, 
    Droplets, ArrowLeft, X, CheckCircle, AlertCircle,
    TrendingUp, TrendingDown, DollarSign, Clock,
    ChevronRight
} from 'lucide-react';
import { route } from '@/lib/route';

export default function EditProduct({ product }: any) {
    const activePrice = product.price_histories[0] || {};
    const previousPrice = product.price_histories[1] || {};

    const { data, setData, put, processing, errors, reset } = useForm({
        name: product.name || '',
        unit: product.unit || '',
        category: product.category || 'fuel',
        purchase_price: activePrice.purchase_price?.toString() || '',
        sale_price: activePrice.sale_price?.toString() || '',
        description: product.description || '',
        min_stock_level: product.min_stock_level?.toString() || '',
        max_stock_level: product.max_stock_level?.toString() || '',
        is_active: product.is_active ?? true
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.products.update', { product: product.id }), {
            onSuccess: () => setShowSuccess(true)
        });
    };

    const handleReset = () => {
        reset();
        setShowResetConfirm(false);
    };

    // Calculate price differences
    const purchasePriceDiff = parseFloat(data.purchase_price) - parseFloat(activePrice.purchase_price || 0);
    const salePriceDiff = parseFloat(data.sale_price) - parseFloat(activePrice.sale_price || 0);
    const currentMargin = parseFloat(activePrice.sale_price || 0) - parseFloat(activePrice.purchase_price || 0);
    const newMargin = parseFloat(data.sale_price || 0) - parseFloat(data.purchase_price || 0);
    const marginDiff = newMargin - currentMargin;

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
            <Head title={`Edit ${product.name}`} />
            
            <div className="space-y-6">
                {/* Premium Header with Icon */}
                <PageHeader 
                    title="Edit Product"
                    description={`Update product details or adjust current rates for ${product.name}`}
                    icon={<Droplets className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                >
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-mono font-bold">
                            #PROD-{String(product.id).padStart(6, '0')}
                        </span>
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
                            Product updated successfully! Changes have been saved.
                        </p>
                        <button 
                            onClick={() => setShowSuccess(false)}
                            className="ml-auto p-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </button>
                    </div>
                )}

                {/* Reset Confirmation Modal */}
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
                                    onClick={handleReset}
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

                        {/* Current Pricing Card */}
                        <FormCard 
                            title="Current Pricing" 
                            icon={<IndianRupee className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Purchase Price */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            Purchase Price
                                        </label>
                                        {previousPrice.purchase_price && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Previous: ₹{parseFloat(previousPrice.purchase_price).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IndianRupee className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.purchase_price}
                                            onChange={e => setData('purchase_price', e.target.value)}
                                            className={`
                                                w-full pl-10 pr-4 py-3 
                                                bg-gray-50 dark:bg-gray-700/50 
                                                border-2 
                                                ${purchasePriceDiff > 0 ? 'border-amber-400 dark:border-amber-500' : 
                                                  purchasePriceDiff < 0 ? 'border-blue-400 dark:border-blue-500' : 
                                                  'border-gray-200 dark:border-gray-600'}
                                                rounded-xl 
                                                text-sm 
                                                focus:outline-none 
                                                focus:ring-2 focus:ring-amber-500/20 
                                                focus:border-amber-500 dark:focus:border-amber-400 
                                                transition-all
                                            `}
                                            placeholder="0.00"
                                        />
                                        {purchasePriceDiff !== 0 && (
                                            <div className="absolute right-3 top-3 flex items-center gap-1">
                                                <span className={`text-xs font-bold ${
                                                    purchasePriceDiff > 0 ? 'text-amber-600' : 'text-blue-600'
                                                }`}>
                                                    {purchasePriceDiff > 0 ? '+' : ''}{purchasePriceDiff.toFixed(2)}
                                                </span>
                                                {purchasePriceDiff > 0 ? (
                                                    <TrendingUp className="w-4 h-4 text-amber-600" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-blue-600" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sale Price */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            Sale Price
                                        </label>
                                        {previousPrice.sale_price && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Previous: ₹{parseFloat(previousPrice.sale_price).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IndianRupee className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.sale_price}
                                            onChange={e => setData('sale_price', e.target.value)}
                                            className={`
                                                w-full pl-10 pr-4 py-3 
                                                bg-gray-50 dark:bg-gray-700/50 
                                                border-2 
                                                ${salePriceDiff > 0 ? 'border-emerald-400 dark:border-emerald-500' : 
                                                  salePriceDiff < 0 ? 'border-rose-400 dark:border-rose-500' : 
                                                  'border-gray-200 dark:border-gray-600'}
                                                rounded-xl 
                                                text-sm 
                                                focus:outline-none 
                                                focus:ring-2 focus:ring-amber-500/20 
                                                focus:border-amber-500 dark:focus:border-amber-400 
                                                transition-all
                                            `}
                                            placeholder="0.00"
                                        />
                                        {salePriceDiff !== 0 && (
                                            <div className="absolute right-3 top-3 flex items-center gap-1">
                                                <span className={`text-xs font-bold ${
                                                    salePriceDiff > 0 ? 'text-emerald-600' : 'text-rose-600'
                                                }`}>
                                                    {salePriceDiff > 0 ? '+' : ''}{salePriceDiff.toFixed(2)}
                                                </span>
                                                {salePriceDiff > 0 ? (
                                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-rose-600" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Margin Calculator */}
                            {(data.purchase_price || data.sale_price) && (
                                <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                                <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                                                    Current Margin
                                                </span>
                                                <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
                                                    ₹{currentMargin.toFixed(2)} per unit
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {marginDiff !== 0 && (
                                            <>
                                                <ChevronRight className="w-5 h-5 text-amber-400" />
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                                        <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                                                            New Margin
                                                        </span>
                                                        <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
                                                            ₹{newMargin.toFixed(2)} per unit
                                                            <span className={`ml-2 text-xs ${
                                                                marginDiff > 0 ? 'text-emerald-600' : 'text-rose-600'
                                                            }`}>
                                                                ({marginDiff > 0 ? '+' : ''}{marginDiff.toFixed(2)})
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Price Change Notice */}
                            {(purchasePriceDiff !== 0 || salePriceDiff !== 0) && (
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                            <strong>Note:</strong> Changing the price will automatically deactivate the old price history and create a new record for tracking historical price fluctuations.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </FormCard>

                        {/* Stock Management Card */}
                        {/* <FormCard 
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
                        </FormCard> */}

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

                        {/* Price History Summary */}
                        {product.price_histories?.length > 1 && (
                            <FormCard title="Price History">
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        This product has {product.price_histories.length} price changes recorded.
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-gray-500" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Last updated: {new Date(product.updated_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <Link
                                        href={route('admin.products.price-history', { product: product.id })}
                                        className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium mt-2"
                                    >
                                        View full price history
                                        <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </FormCard>
                        )}

                        {/* Form Actions */}
                        <FormActions
                            processing={processing}
                            submitLabel="Update Product"
                            cancelUrl={route('admin.products.index')}
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