import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/admin/page-header';
import FormLayout from '@/components/admin/FormLayout';
import FormCard from '@/components/admin/FormCard';
import FormGrid from '@/components/admin/FormGrid';
import FormInput from '@/components/admin/FormInput';
import FormSelect from '@/components/admin/FormSelect';
import ItemsTable from '@/components/admin/ItemsTable';
import FormActions from '@/components/admin/FormActions';
import { Head, useForm } from '@inertiajs/react';
import { ShoppingCart, User, FileText, Calendar, Package } from 'lucide-react';
import { route } from '@/lib/route';

export default function CreatePurchase({ parties, products }: any) {
    const { data, setData, post, processing, errors } = useForm({
        party_id: '',
        purchase_date: new Date().toISOString().split('T')[0],
        bill_number: '',
        reference_number: '',
        items: [{ product_id: '', quantity: 1, purchase_price: 0 }]
    });

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
        newItems[index] = { ...newItems[index], [field]: field === 'quantity' || field === 'purchase_price' ? parseFloat(value) || 0 : value };
        
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

    const isValid = data.party_id && data.items.every(i => i.product_id && parseFloat(i.quantity as any) > 0);

    return (
        <AppLayout>
            <Head title="New Purchase" />
            
            <div className="space-y-6">
                <PageHeader 
                    title="Create Purchase Entry" 
                    description="Record incoming stock from suppliers."
                    icon={<ShoppingCart className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                />

                <FormLayout onSubmit={(e) => { e.preventDefault(); post(route('admin.purchases.store')); }}>
                    {/* Supplier Information */}
                    <FormCard 
                        title="Supplier Information" 
                        icon={<User className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    >
                        <FormGrid cols={3}>
                            <FormSelect
                                label="Supplier"
                                required
                                icon={<User className="w-4 h-4 text-gray-400" />}
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
                                icon={<FileText className="w-4 h-4 text-gray-400" />}
                                type="text"
                                value={data.bill_number}
                                onChange={e => setData('bill_number', e.target.value)}
                                error={errors.bill_number}
                                placeholder="Enter bill number"
                            />
                            
                            <FormInput
                                label="Purchase Date"
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

                    {/* Form Actions */}
                    <FormActions
                        processing={processing}
                        submitLabel="Save Purchase"
                        cancelUrl={route('admin.purchases.index')}
                        cancelLabel="Cancel"
                        isValid={isValid}
                    />
                </FormLayout>
            </div>
        </AppLayout>
    );
}