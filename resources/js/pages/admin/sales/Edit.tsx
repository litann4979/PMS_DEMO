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
    Save, User, Car, ShoppingCart, 
    Calendar, Receipt, X, AlertCircle, 
    Fuel, Users, Clock
} from 'lucide-react';
import { route } from '@/lib/route';

export default function EditSale({ sale, customers, products }: any) {
    // Parse sale items to ensure sale_price is a number
    const parsedItems = sale.items.map((i: any) => ({
        id: i.id,
        product_id: i.product_id,
        quantity: parseFloat(i.quantity) || 0,
        sale_price: parseFloat(i.sale_price) || 0
    }));

    const { data, setData, put, processing, errors } = useForm({
        customer_id: sale.customer_id,
        vehicle_id: sale.vehicle_id,
        sale_date: sale.sale_date,
        items: parsedItems,
        notes: sale.notes || ''
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const selectedCustomer = customers.find((c: any) => c.id == data.customer_id);
    const availableVehicles = selectedCustomer?.vehicles || [];

    const addItem = () => {
        setData('items', [...data.items, { product_id: '', quantity: 1, sale_price: 0 }]);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        
        if (field === 'quantity') {
            newItems[index] = { ...newItems[index], [field]: parseFloat(value) || 0 };
        } else if (field === 'sale_price') {
            newItems[index] = { ...newItems[index], [field]: parseFloat(value) || 0 };
        } else {
            newItems[index] = { ...newItems[index], [field]: value };
        }
        
        if (field === 'product_id') {
            const prod = products.find((p: any) => p.id == value);
            newItems[index].sale_price = parseFloat(prod?.price_histories[0]?.sale_price) || 0;
        }
        
        setData('items', newItems);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const total = data.items.reduce((sum, i) => {
        const qty = parseFloat(i.quantity) || 0;
        const price = parseFloat(i.sale_price) || 0;
        return sum + (qty * price);
    }, 0);
    
    const totalItems = data.items.length;
    const isValid = data.customer_id && data.vehicle_id && data.items.every(i => i.product_id && parseFloat(i.quantity) > 0);

    return (
        <AppLayout>
            <Head title={`Edit Invoice ${sale.invoice_number}`} />
            
            <div className="space-y-6">
                {/* Premium Header with Icon */}
                <PageHeader 
                    title="Edit Sale"
                    description={`Modifying invoice #${sale.invoice_number}`}
                    icon={<ShoppingCart className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                >
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-mono font-bold">
                            {sale.invoice_number}
                        </span>
                        <Link
                            href={route('admin.sales.index')}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancel
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
                            Sale updated successfully! Changes have been saved.
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
                    put(route('admin.sales.update', { sale: sale.id }), {
                        onSuccess: () => setShowSuccess(true)
                    });
                }}>
                    {/* Main Form Grid - 2/3 and 1/3 layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - 2/3 width */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer & Vehicle Information */}
                            <FormCard 
                                title="Customer Information" 
                                icon={<User className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                            >
                                <FormGrid cols={2}>
                                    <FormSelect
                                        label="Customer"
                                        required
                                        icon={<Users className="w-4 h-4 text-gray-400" />}
                                        value={data.customer_id}
                                        onChange={e => {
                                            setData('customer_id', e.target.value);
                                            setData('vehicle_id', '');
                                        }}
                                        error={errors.customer_id}
                                        options={[
                                            { value: '', label: 'Select customer' },
                                            ...customers.map((c: any) => ({ 
                                                value: c.id, 
                                                label: `${c.name} ${c.company_name ? `- ${c.company_name}` : ''}`
                                            }))
                                        ]}
                                    />
                                    
                                    <FormSelect
                                        label="Vehicle"
                                        required
                                        icon={<Car className="w-4 h-4 text-gray-400" />}
                                        value={data.vehicle_id}
                                        onChange={e => setData('vehicle_id', e.target.value)}
                                        error={errors.vehicle_id}
                                        disabled={!data.customer_id}
                                        options={[
                                            { value: '', label: !data.customer_id ? 'Select customer first' : 'Select vehicle' },
                                            ...availableVehicles.map((v: any) => ({ 
                                                value: v.id, 
                                                label: `${v.vehicle_number} (${v.vehicle_type})`
                                            }))
                                        ]}
                                    />
                                    
                                    <div className="md:col-span-2">
                                        <FormInput
                                            label="Sale Date"
                                            icon={<Calendar className="w-4 h-4 text-gray-400" />}
                                            type="date"
                                            value={data.sale_date}
                                            onChange={e => setData('sale_date', e.target.value)}
                                            error={errors.sale_date}
                                        />
                                    </div>
                                </FormGrid>
                            </FormCard>

                            {/* Items Table */}
                            <ItemsTable
                                items={data.items}
                                products={products}
                                onUpdate={updateItem}
                                onRemove={removeItem}
                                onAdd={addItem}
                                totalAmount={total}
                                type="sale"
                                errors={errors}
                            />

                            {/* Notes Field */}
                            <FormCard>
                                <FormInput
                                    label="Sale Notes (Optional)"
                                    type="textarea"
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Add any additional notes about this sale..."
                                    rows={3}
                                />
                            </FormCard>
                        </div>

                        {/* Right Column - 1/3 width */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <OrderSummary
                                title="Order Summary"
                                total={total}
                                itemsCount={totalItems}
                                className="sticky top-6"
                            >
                                <div className="flex justify-between items-center py-2 border-b border-amber-200/50 dark:border-amber-700/30">
                                    <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Invoice</span>
                                    <span className="text-sm font-bold text-amber-800 dark:text-amber-200 bg-white dark:bg-gray-800 px-3 py-1 rounded-full font-mono">
                                        {sale.invoice_number}
                                    </span>
                                </div>

                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {data.items.map((item: any, idx: number) => {
                                        const product = products.find((p: any) => p.id == item.product_id);
                                        if (!item.product_id) return null;
                                        const quantity = parseFloat(item.quantity) || 0;
                                        const salePrice = parseFloat(item.sale_price) || 0;
                                        
                                        return (
                                            <div key={idx} className="flex justify-between text-xs">
                                                <span className="text-gray-600 dark:text-gray-400 truncate max-w-[120px]">
                                                    {product?.name}
                                                </span>
                                                <span className="font-mono font-medium text-gray-700 dark:text-gray-300">
                                                    {quantity} x ₹{salePrice.toFixed(2)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </OrderSummary>

                            {/* Customer Summary Card */}
                            {selectedCustomer && (
                                <FormCard title="Customer Summary">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                                                <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {selectedCustomer.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {selectedCustomer.mobile}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedCustomer.vehicles && (
                                            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                                                    <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        {selectedCustomer.vehicles.length} Registered Vehicles
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
                                            {new Date(sale.created_at).toLocaleDateString('en-IN', {
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
                                            {new Date(sale.updated_at).toLocaleDateString('en-IN', {
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
                        submitLabel="Update Sale"
                        cancelUrl={route('admin.sales.index')}
                        cancelLabel="Cancel"
                        isValid={isValid}
                    />
                </FormLayout>
            </div>
        </AppLayout>
    );
}