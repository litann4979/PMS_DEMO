import { Receipt, ShoppingCart, DollarSign } from 'lucide-react';

interface OrderSummaryProps {
    title?: string;
    total: number;
    itemsCount: number;
    children?: React.ReactNode;
    className?: string;
}

export default function OrderSummary({ 
    title = 'Order Summary', 
    total, 
    itemsCount, 
    children,
    className = '' 
}: OrderSummaryProps) {
    return (
        <div className={`bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-6 shadow-lg ${className}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <Receipt className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200">
                    {title}
                </h3>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-amber-200/50 dark:border-amber-700/30">
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Items</span>
                    <span className="text-sm font-bold text-amber-800 dark:text-amber-200 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">
                        {itemsCount}
                    </span>
                </div>

                {children}

                <div className="flex justify-between items-center pt-4 border-t border-amber-200/50 dark:border-amber-700/30">
                    <span className="text-base font-bold text-amber-800 dark:text-amber-200">Total Amount</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    );
}