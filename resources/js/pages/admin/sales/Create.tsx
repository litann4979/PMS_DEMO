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
import { Head, useForm } from '@inertiajs/react';
import { ShoppingBag, User, Car, Calendar, Fuel, Users } from 'lucide-react';
import { route } from '@/lib/route';

export default function CreateSale({ customers, products,nozzles }: any) {
  const { data, setData, post, processing, errors } = useForm({
    customer_id: '',
    vehicle_id: '',
    sale_date: new Date().toISOString().split('T')[0],
    items: [{ product_id: '', nozzle_id: '', quantity: 1, sale_price: 0 }],
    payment_method: 'CASH',
    paid_amount: 0,
    transaction_reference_id: '',
    notes: ''
});


    const [showSuccess, setShowSuccess] = useState(false);
    const selectedCustomer = customers.find((c: any) => c.id == data.customer_id);
    const availableVehicles = selectedCustomer?.vehicles || [];

    const addItem = () => {
        setData('items', [...data.items, { product_id: '', nozzle_id: '', quantity: 1, sale_price: 0 }]);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: field === 'quantity' || field === 'sale_price' ? parseFloat(value) || 0 : value };
        
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
        const qty = parseFloat(i.quantity as any) || 0;
        const price = parseFloat(i.sale_price as any) || 0;
        return sum + (qty * price);
    }, 0);

    const paidAmount = parseFloat(data.paid_amount as any) || 0;
const balanceAmount = total - paidAmount;

    
    const totalItems = data.items.length;
    const isValid = data.customer_id && data.vehicle_id && data.items.every(i => i.product_id && parseFloat(i.quantity as any) > 0);

    return (
        <AppLayout>
            <Head title="Point of Sale" />
            
            <div className="space-y-6">
                <PageHeader 
                    title="New Sale" 
                    description="Create a fuel sale invoice and process payment."
                    icon={<ShoppingBag className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                />

                <FormLayout onSubmit={(e) => { 
                    e.preventDefault(); 
                    post(route('admin.sales.store'), {
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
                                nozzles={nozzles}
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
                              {/* Payment Section */}
<div className="pt-4 space-y-4">

    <label className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
        Payment Method
    </label>

    <div className="grid grid-cols-2 gap-3">
        {['CASH', 'CARD', 'RTGS', 'UPI'].map((method) => (
            <label
                key={method}
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                    data.payment_method === method
                        ? 'bg-amber-600 border-amber-600 text-white'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
            >
                <input
                    type="radio"
                    value={method}
                    checked={data.payment_method === method}
                    onChange={(e) => setData('payment_method', e.target.value)}
                    className="sr-only"
                />
                <span className="text-xs font-bold uppercase">
                    {method}
                </span>
            </label>
        ))}
    </div>

    {/* Paid Amount Input */}
    <div>
        <label className="text-xs font-semibold block mb-1">
            Amount Paid
        </label>
        <input
            type="number"
            min="0"
            max={total}
            value={data.paid_amount}
            onChange={(e) => setData('paid_amount', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border"
        />
    </div>

    {/* Pending Amount Display */}
    <div className="flex justify-between text-sm font-semibold">
        <span>Pending Amount:</span>
        <span className={balanceAmount > 0 ? "text-red-500" : "text-green-600"}>
            ₹ {balanceAmount.toFixed(2)}
        </span>
    </div>

    {/* Transaction Reference */}
    {data.payment_method !== 'CASH' && (
        <div>
            <label className="text-xs font-semibold block mb-1">
                Transaction Reference ID
            </label>
            <input
                type="text"
                value={data.transaction_reference_id}
                onChange={(e) => setData('transaction_reference_id', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
            />
        </div>
    )}
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
                        </div>
                    </div>

                    {/* Form Actions - Full Width */}
                    <FormActions
                        processing={processing}
                        submitLabel="Complete Sale"
                        cancelUrl={route('admin.sales.index')}
                        cancelLabel="Cancel"
                        isValid={isValid}
                    />
                </FormLayout>
            </div>
        </AppLayout>
    );
}