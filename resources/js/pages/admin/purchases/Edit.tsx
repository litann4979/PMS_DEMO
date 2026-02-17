import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/admin/page-header';
import FormLayout from '@/components/admin/FormLayout';
import FormCard from '@/components/admin/FormCard';
import FormGrid from '@/components/admin/FormGrid';
import FormInput from '@/components/admin/FormInput';
import FormSelect from '@/components/admin/FormSelect';
import ItemsTable from '@/components/admin/ItemsTable';
import FormActions from '@/components/admin/FormActions';
import OrderSummary from '@/components/admin/OrderSummary';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Save, ShoppingCart, User, FileText, 
    Calendar, Package, Truck, ArrowLeft,
    X, Clock, Receipt
} from 'lucide-react';
import { route } from '@/lib/route';

export default function EditPurchase({ purchase, parties, products }: any) {
    // Parse purchase items to ensure numbers are properly formatted
    const parsedItems = purchase.items.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: parseFloat(item.quantity) || 0,
        purchase_price: parseFloat(item.purchase_price) || 0
    }));

    const { data, setData, put, processing, errors } = useForm({
        party_id: purchase.party_id,
        purchase_date: purchase.purchase_date,
        bill_number: purchase.bill_number || '',
        reference_number: purchase.reference_number || '',
        items: parsedItems,
        notes: purchase.notes || ''
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const selectedParty = parties.find((p: any) => p.id == data.party_id);

    const addItem = () => {
        setData('items', [...data.items, { product_id: '', quantity: 1, purchase_price: 0 }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        
        if (field === 'quantity') {
            newItems[index] = { ...newItems[index], [field]: parseFloat(value) || 0 };
        } else if (field === 'purchase_price') {
            newItems[index] = { ...newItems[index], [field]: parseFloat(value) || 0 };
        } else {
            newItems[index] = { ...newItems[index], [field]: value };
        }
        
        if (field === 'product_id') {
            const prod = products.find((p: any) => p.id == value);
            newItems[index].purchase_price = parseFloat(prod?.price_histories[0]?.purchase_price) || 0;
        }
        
        setData('items', newItems);
    };

    const totalAmount = data.items.reduce((sum, item) => {
        const qty = parseFloat(item.quantity as any) || 0;
        const price = parseFloat(item.purchase_price as any) || 0;
        return sum + (qty * price);
    }, 0);
    
    const totalItems = data.items.length;
    const isValid = data.party_id && data.items.every(i => i.product_id && parseFloat(i.quantity as any) > 0);

    return (
        <AppLayout>
            <Head title={`Edit Purchase #PUR-${purchase.id}`} />
            
            <div className="space-y-6">
                {/* Premium Header with Icon */}
                <PageHeader 
                    title="Edit Purchase"
                    description={`Adjust items and quantities for procurement #PUR-${String(purchase.id).padStart(6, '0')}`}
                    icon={<ShoppingCart className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                >
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-mono font-bold">
                            #PUR-{String(purchase.id).padStart(6, '0')}
                        </span>
                        <Link
                            href={route('admin.purchases.index')}
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
                            <Save className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                            Purchase updated successfully! Changes have been saved.
                        </p>
                        <button 
                            onClick={() => setShowSuccess(false)}
                            className="ml-auto p-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </button>
                    </div>
                )}

                <FormLayout onSubmit={(e) => { 
                    e.preventDefault(); 
                    put(route('admin.purchases.update', { purchase: purchase.id }), {
                        onSuccess: () => setShowSuccess(true)
                    });
                }}>
                    {/* Main Form Grid - 2/3 and 1/3 layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - 2/3 width */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Supplier Information */}
                            <FormCard 
                                title="Supplier Information" 
                                icon={<User className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                            >
                                <FormGrid cols={3}>
                                    <FormSelect
                                        label="Supplier"
                                        required
                                        icon={<Truck className="w-4 h-4 text-gray-400" />}
                                        value={data.party_id}
                                        onChange={e => setData('party_id', e.target.value)}
                                        error={errors.party_id}
                                        options={[
                                            { value: '', label: 'Select supplier' },
                                            ...parties.map((p: any) => ({ 
                                                value: p.id, 
                                                label: p.name 
                                            }))
                                        ]}
                                    />
                                    
                                    <FormInput
                                        label="Bill Number"
                                        required
                                        icon={<FileText className="w-4 h-4 text-gray-400" />}
                                        type="text"
                                        value={data.bill_number}
                                        onChange={e => setData('bill_number', e.target.value)}
                                        error={errors.bill_number}
                                        placeholder="Enter bill number"
                                    />
                                    
                                    <FormInput
                                        label="Purchase Date"
                                        required
                                        icon={<Calendar className="w-4 h-4 text-gray-400" />}
                                        type="date"
                                        value={data.purchase_date}
                                        onChange={e => setData('purchase_date', e.target.value)}
                                        error={errors.purchase_date}
                                    />
                                </FormGrid>
                                
                                <div className="mt-4">
                                    <FormInput
                                        label="Reference Number (Optional)"
                                        icon={<Package className="w-4 h-4 text-gray-400" />}
                                        type="text"
                                        value={data.reference_number}
                                        onChange={e => setData('reference_number', e.target.value)}
                                        placeholder="Enter reference number"
                                    />
                                </div>
                            </FormCard>

                            {/* Items Table */}
                            <ItemsTable
                                items={data.items}
                                products={products}
                                onUpdate={updateItem}
                                onRemove={removeItem}
                                onAdd={addItem}
                                totalAmount={totalAmount}
                                type="purchase"
                                errors={errors}
                            />

                            {/* Notes Field */}
                            <FormCard>
                                <FormInput
                                    label="Purchase Notes (Optional)"
                                    type="textarea"
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Add any additional notes about this purchase..."
                                    rows={3}
                                />
                            </FormCard>
                        </div>

                        {/* Right Column - 1/3 width */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <OrderSummary
                                title="Purchase Summary"
                                total={totalAmount}
                                itemsCount={totalItems}
                                className="sticky top-6"
                            >
                                <div className="flex justify-between items-center py-2 border-b border-amber-200/50 dark:border-amber-700/30">
                                    <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Purchase ID</span>
                                    <span className="text-sm font-bold text-amber-800 dark:text-amber-200 bg-white dark:bg-gray-800 px-3 py-1 rounded-full font-mono">
                                        #PUR-{String(purchase.id).padStart(6, '0')}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-amber-200/50 dark:border-amber-700/30">
                                    <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Bill Number</span>
                                    <span className="text-sm font-bold text-amber-800 dark:text-amber-200 bg-white dark:bg-gray-800 px-3 py-1 rounded-full font-mono">
                                        {data.bill_number || 'N/A'}
                                    </span>
                                </div>

                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {data.items.map((item: any, idx: number) => {
                                        const product = products.find((p: any) => p.id == item.product_id);
                                        if (!item.product_id) return null;
                                        const quantity = parseFloat(item.quantity) || 0;
                                        const price = parseFloat(item.purchase_price) || 0;
                                        
                                        return (
                                            <div key={idx} className="flex justify-between text-xs">
                                                <span className="text-gray-600 dark:text-gray-400 truncate max-w-[120px]">
                                                    {product?.name}
                                                </span>
                                                <span className="font-mono font-medium text-gray-700 dark:text-gray-300">
                                                    {quantity} x ₹{price.toFixed(2)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </OrderSummary>

                            {/* Supplier Summary Card */}
                            {selectedParty && (
                                <FormCard title="Supplier Summary">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                                                <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {selectedParty.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {selectedParty.mobile}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedParty.email && (
                                            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                                                    <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        {selectedParty.email}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </FormCard>
                            )}

                            {/* Audit Info Card */}
                            <FormCard title="Audit Information">
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Created
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {new Date(purchase.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Last Updated
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {new Date(purchase.updated_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </FormCard>
                        </div>
                    </div>

                    {/* Form Actions - Full Width */}
                    <FormActions
                        processing={processing}
                        submitLabel="Update Purchase"
                        cancelUrl={route('admin.purchases.index')}
                        cancelLabel="Cancel"
                        isValid={isValid}
                    />
                </FormLayout>
            </div>
        </AppLayout>
    );
}