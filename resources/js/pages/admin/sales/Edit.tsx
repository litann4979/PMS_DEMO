import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
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

export default function EditSale({ sale, customers, products, nozzles }: any) {
    // Parse sale items to ensure sale_price is a number
    const parsedItems = sale.items.map((i: any) => ({
        id: i.id,
        product_id: i.product_id,
        nozzle_id: i.nozzle_id || '',
        quantity: parseFloat(i.quantity) || 0,
        sale_price: parseFloat(i.sale_price) || 0
    }));

    const { data, setData, put, processing, errors } = useForm({
        customer_id: sale.customer_id,
        vehicle_id: sale.vehicle_id,
        sale_date: sale.sale_date,
        items: parsedItems,
        additional_payment: 0,
        payment_method: 'CASH',
        transaction_reference_id: '',
        notes: sale.notes || ''
    });


    const [showSuccess, setShowSuccess] = useState(false);
    const selectedCustomer = customers.find((c: any) => c.id == data.customer_id);
    const availableVehicles = selectedCustomer?.vehicles || [];

    const addItem = () => {
        setData('items', [...data.items, { product_id: '', nozzle_id: '', quantity: 1, sale_price: 0 }]);
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
    const existingPaid = parseFloat(sale.paid_amount) || 0;
    const additionalPayment = parseFloat(data.additional_payment as any) || 0;
    const newPaidTotal = existingPaid + additionalPayment;
    const newBalance = total - newPaidTotal;

    // Stock validation — for edit, account for the current sale's quantities being restored
    const getProductStock = (productId: string | number) => {
        const prod = products.find((p: any) => p.id == productId);
        const baseStock = prod?.available_stock ?? 0;
        // Add back old sale quantities for this product (they'll be restored on update)
        const oldQty = sale.items
            .filter((i: any) => i.product_id == productId)
            .reduce((sum: number, i: any) => sum + (parseFloat(i.quantity) || 0), 0);
        return baseStock + oldQty;
    };

    const stockWarnings = data.items.map((item) => {
        if (!item.product_id) return null;
        const available = getProductStock(item.product_id);
        const qty = parseFloat(item.quantity as any) || 0;
        if (qty > available) {
            const prod = products.find((p: any) => p.id == item.product_id);
            return `${prod?.name || 'Product'} has only ${Math.round(available * 100) / 100} units available`;
        }
        return null;
    });

    const hasStockIssue = stockWarnings.some((w) => w !== null);


    const totalItems = data.items.length;
    const isValid = data.customer_id && data.vehicle_id && !hasStockIssue && data.items.every(i => i.product_id && parseFloat(i.quantity) > 0);

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
                                nozzles={nozzles}
                                onUpdate={updateItem}
                                onRemove={removeItem}
                                onAdd={addItem}
                                totalAmount={total}
                                type="sale"
                                errors={errors}
                            />

                            {/* Stock Warnings */}
                            {stockWarnings.some(w => w) && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold text-sm">
                                        <AlertTriangle className="w-4 h-4" />
                                        Insufficient Stock
                                    </div>
                                    {stockWarnings.map((warning, i) => warning && (
                                        <p key={i} className="text-xs text-red-600 dark:text-red-400 ml-6">
                                            • {warning}
                                        </p>
                                    ))}
                                </div>
                            )}

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

                        <div className="space-y-3">

                            {/* Total */}
                            <div className="flex justify-between text-sm font-semibold">
                                <span>Total Amount</span>
                                <span>₹ {total.toFixed(2)}</span>
                            </div>

                            {/* Already Paid */}
                            <div className="flex justify-between text-sm text-green-600 font-semibold">
                                <span>Already Paid</span>
                                <span>₹ {existingPaid.toFixed(2)}</span>
                            </div>

                            {/* Remaining Before Edit */}
                            <div className="flex justify-between text-sm text-red-500 font-semibold">
                                <span>Current Balance</span>
                                <span>₹ {parseFloat(sale.balance_amount).toFixed(2)}</span>
                            </div>

                            {/* Additional Payment Input */}
                            {sale.balance_amount > 0 && (
                                <>
                                    <div className="pt-2 border-t">
                                        <label className="text-xs font-semibold block mb-1">
                                            Additional Payment
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max={sale.balance_amount}
                                            value={data.additional_payment}
                                            onChange={(e) => setData('additional_payment', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border"
                                        />
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <label className="text-xs font-semibold block mb-1">
                                            Payment Method
                                        </label>
                                        <select
                                            className="w-full px-3 py-2 rounded-lg border"
                                            value={data.payment_method}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                        >
                                            <option value="CASH">Cash</option>
                                            <option value="CARD">Card</option>
                                            <option value="RTGS">RTGS</option>
                                            <option value="UPI">UPI</option>
                                        </select>
                                    </div>

                                    {/* Reference ID */}
                                    {data.payment_method !== 'CASH' && (
                                        <input
                                            type="text"
                                            placeholder="Transaction Reference ID"
                                            value={data.transaction_reference_id}
                                            onChange={(e) => setData('transaction_reference_id', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border"
                                        />
                                    )}

                                    {/* New Balance Preview */}
                                    <div className="flex justify-between text-sm font-bold">
                                        <span>New Balance</span>
                                        <span className={newBalance > 0 ? "text-red-500" : "text-green-600"}>
                                            ₹ {newBalance.toFixed(2)}
                                        </span>
                                    </div>
                                </>
                            )}

                            {/* Status Badge */}
                            <div className="pt-2">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${sale.status === 'PAID'
                                        ? 'bg-green-100 text-green-700'
                                        : sale.status === 'PARTIALLY_PAID'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                    {sale.status}
                                </span>
                            </div>
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