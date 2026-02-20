import { Plus, Trash2, Fuel, AlertCircle } from 'lucide-react';

interface Item {
    product_id: string | number;
    quantity: number;
    purchase_price?: number;
    sale_price?: number;
    [key: string]: any;
}

interface ItemsTableProps {
    items: Item[];
    products: Array<{ id: number; name: string; unit: string; price_histories?: Array<{ purchase_price?: number; sale_price?: number }> }>;
    nozzles?: any[];
    onUpdate: (index: number, field: string, value: any) => void;
    onRemove: (index: number) => void;
    onAdd: () => void;
    totalAmount: number;
    type?: 'purchase' | 'sale';
    errors?: any;
}

export default function ItemsTable({ 
    items, 
    products, 
    nozzles = [],
    onUpdate, 
    onRemove, 
    onAdd, 
    totalAmount,
    type = 'purchase',
    errors 
}: ItemsTableProps) {
    const priceField = type === 'purchase' ? 'purchase_price' : 'sale_price';
    const priceLabel = type === 'purchase' ? 'Price/Unit' : 'Unit Price';
    
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-4 md:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    {type === 'purchase' ? 'Purchase Items' : 'Sale Items'}
                </h3>
                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold transition-all duration-200 w-full sm:w-auto justify-center"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Item
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-700/20 border-b border-gray-200 dark:border-gray-700">
                            <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Product</th>
                                {type === 'sale' && (
        <th className="px-4 md:px-6 py-4 text-xs font-semibold w-36">
            Nozzle
        </th>
    )}
                            <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-24 md:w-28">Quantity</th>
                            <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-28 md:w-32">{priceLabel}</th>
                            <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-28 md:w-32 text-right">Subtotal</th>
                            <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {items.map((item, index) => {
                            const product = products.find((p: any) => p.id == item.product_id);
                            const quantity = parseFloat(item.quantity as any) || 0;
                            const price = parseFloat(item[priceField] as any) || 0;
                            const subtotal = quantity * price;
                            
                            return (
                                <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                                    <td className="px-4 md:px-6 py-4">
                                        <select 
                                            className="w-full min-w-[150px] px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-400 transition-all"
                                            value={item.product_id} 
                                            onChange={e => onUpdate(index, 'product_id', e.target.value)}
                                        >
                                            <option value="">Select product</option>
                                            {products.map((p: any) => (
                                                <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                                            ))}
                                        </select>
                                    </td>
                                                                            {type === 'sale' && (
                                        <td className="px-4 md:px-6 py-4">
                                            <select
                                                className="w-full min-w-[120px] px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                                value={item.nozzle_id || ''}
                                                onChange={e => onUpdate(index, 'nozzle_id', e.target.value)}
                                                disabled={!item.product_id}
                                            >
                                                <option value="">Select nozzle</option>

                                                {nozzles
                                                    .filter((n: any) => n.product_id == item.product_id)
                                                    .map((n: any) => (
                                                        <option key={n.id} value={n.id}>
                                                            Nozzle #{n.nozzle_number}
                                                        </option>
                                                    ))}
                                            </select>
                                        </td>
                                        )}
                                    <td className="px-4 md:px-6 py-4">
                                        <input 
                                            type="number" 
                                            min="0.01" 
                                            step="0.01"
                                            className="w-20 md:w-24 px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-400 transition-all"
                                            value={item.quantity} 
                                            onChange={e => onUpdate(index, 'quantity', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 md:px-6 py-4">
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
                                            <input 
                                                type="number" 
                                                min="0.01" 
                                                step="0.01"
                                                className="w-24 md:w-28 pl-8 pr-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-400 transition-all"
                                                value={item[priceField]} 
                                                onChange={e => onUpdate(index, priceField, e.target.value)}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-right">
                                        <span className="font-mono font-bold text-gray-900 dark:text-white">
                                            ₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 py-4">
                                        <button 
                                            type="button" 
                                            onClick={() => onRemove(index)}
                                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-900/30 rounded-lg transition-all duration-200"
                                            disabled={items.length === 1}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {items.length === 0 && (
                <div className="text-center py-12 px-6">
                    <div className="inline-flex p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl mb-3">
                        <Fuel className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">No items added</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Click "Add Item" to start adding products.</p>
                    <button
                        type="button"
                        onClick={onAdd}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all duration-200"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add First Item
                    </button>
                </div>
            )}

            {errors?.items && (
                <div className="px-6 py-3 bg-rose-50 dark:bg-rose-900/20 border-t border-rose-200 dark:border-rose-800">
                    <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.items}
                    </p>
                </div>
            )}

            <div className="px-4 md:px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount:</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    );
}