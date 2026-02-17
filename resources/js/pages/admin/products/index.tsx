import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PageHeader from '@/components/admin/page-header';
import { Head, Link } from '@inertiajs/react';
import { 
    Droplets, Plus, Pencil, LayoutGrid, List,
    Fuel, Package, TrendingUp, TrendingDown,
    ChevronRight, Search, AlertCircle, BarChart3,
    DollarSign, Gauge, Flame, Beaker
} from 'lucide-react';
import { route } from '@/lib/route';

export default function ProductIndex({ products }: { products: any[] }) {
    const [viewType, setViewType] = useState<'table' | 'grid'>('grid');
    const [searchTerm, setSearchTerm] = useState('');

    // Calculate stats
    const totalProducts = products.length;
    const fuelProducts = products.filter((p: any) => p.category === 'fuel' || p.name.toLowerCase().includes('petrol') || p.name.toLowerCase().includes('diesel')).length;
    const lubricantProducts = products.filter((p: any) => p.category === 'lubricant' || p.name.toLowerCase().includes('oil')).length;
    
    const avgPurchasePrice = products.length 
        ? products.reduce((sum, p) => sum + parseFloat(p.price_histories[0]?.purchase_price || 0), 0) / products.length 
        : 0;
    
    const avgSalePrice = products.length 
        ? products.reduce((sum, p) => sum + parseFloat(p.price_histories[0]?.sale_price || 0), 0) / products.length 
        : 0;

    // Filter products based on search
    const filteredProducts = products.filter((product: any) => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getProductIcon = (product: any) => {
        const name = product.name?.toLowerCase();
        if (name.includes('petrol') || name.includes('gasoline')) {
            return <Flame className="w-5 h-5" />;
        } else if (name.includes('diesel')) {
            return <Fuel className="w-5 h-5" />;
        } else if (name.includes('oil') || name.includes('lubricant')) {
            return <Beaker className="w-5 h-5" />;
        }
        return <Droplets className="w-5 h-5" />;
    };

    const getProductColor = (product: any) => {
        const name = product.name?.toLowerCase();
        if (name.includes('petrol')) return 'from-amber-500 to-orange-500';
        if (name.includes('diesel')) return 'from-blue-500 to-cyan-500';
        if (name.includes('oil')) return 'from-emerald-500 to-teal-500';
        return 'from-amber-600 to-amber-500';
    };

    return (
        <AppLayout>
            <Head title="Fuel & Products" />
            
            <div className="space-y-4 sm:space-y-6">
                {/* Premium Header with Icon and Right-aligned Button - Mobile Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm gap-4 sm:gap-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg sm:rounded-xl">
                            <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                Product Management
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                                Manage fuel types, lubricants, and current market pricing.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Search Bar - Mobile Optimized */}
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-9 pr-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-400 transition-all"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 sm:top-3" />
                        </div>

                        {/* Premium View Toggle */}
                        <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 self-start sm:self-auto">
                            <button 
                                onClick={() => setViewType('table')} 
                                className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 ${
                                    viewType === 'table' 
                                        ? 'bg-white dark:bg-gray-800 shadow-sm text-amber-600 dark:text-amber-400 border border-gray-200 dark:border-gray-600' 
                                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                                title="Table View"
                            >
                                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button 
                                onClick={() => setViewType('grid')} 
                                className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 ${
                                    viewType === 'grid' 
                                        ? 'bg-white dark:bg-gray-800 shadow-sm text-amber-600 dark:text-amber-400 border border-gray-200 dark:border-gray-600' 
                                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                                title="Grid View"
                            >
                                <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </div>

                        <Link 
                            href={route('admin.products.create')} 
                            className="group relative bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium inline-flex items-center justify-center shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                        >
                            <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> 
                            <span className="whitespace-nowrap">Add New Product</span>
                        </Link>
                    </div>
                </div>

                {/* Premium Stats Cards - Mobile Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg">
                                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Total Products</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{totalProducts}</p>
                                <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 sm:mt-1 flex items-center gap-0.5 sm:gap-1">
                                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    Active inventory
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg">
                                <Fuel className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Fuel Types</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{fuelProducts}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">Petrol, Diesel, etc.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg">
                                <Beaker className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Lubricants</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{lubricantProducts}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">Oils & greases</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg">
                                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Avg. Margin</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    ₹{(avgSalePrice - avgPurchasePrice).toFixed(2)}
                                </p>
                                <p className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 mt-0.5 sm:mt-1">Per unit</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price Overview Cards - Mobile Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg sm:rounded-xl border border-amber-100 dark:border-amber-800/30 p-4 sm:p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-300 uppercase tracking-wider font-medium">Average Purchase Price</p>
                                <p className="text-2xl sm:text-3xl font-bold text-amber-800 dark:text-amber-200 mt-0.5 sm:mt-1">
                                    ₹{avgPurchasePrice.toFixed(2)}
                                </p>
                                <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 mt-1 sm:mt-2 flex items-center gap-0.5 sm:gap-1">
                                    <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    Cost per unit
                                </p>
                            </div>
                            <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg sm:rounded-xl border border-emerald-100 dark:border-emerald-800/30 p-4 sm:p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] sm:text-xs text-emerald-700 dark:text-emerald-300 uppercase tracking-wider font-medium">Average Sale Price</p>
                                <p className="text-2xl sm:text-3xl font-bold text-emerald-800 dark:text-emerald-200 mt-0.5 sm:mt-1">
                                    ₹{avgSalePrice.toFixed(2)}
                                </p>
                                <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 mt-1 sm:mt-2 flex items-center gap-0.5 sm:gap-1">
                                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    Revenue per unit
                                </p>
                            </div>
                            <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {viewType === 'table' ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-gray-900/30">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Product Details</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Unit</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Purchase Price</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sale Price</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Margin</th>
                                        <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredProducts.map((product: any, index: number) => {
                                        const purchasePrice = parseFloat(product.price_histories[0]?.purchase_price || 0);
                                        const salePrice = parseFloat(product.price_histories[0]?.sale_price || 0);
                                        const margin = salePrice - purchasePrice;
                                        const marginPercentage = purchasePrice ? ((margin / purchasePrice) * 100).toFixed(1) : 0;
                                        
                                        return (
                                            <tr 
                                                key={product.id} 
                                                className="group hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-gray-50/40 dark:hover:from-gray-700/40 dark:hover:to-gray-700/20 transition-all duration-200"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className={`p-1.5 sm:p-2 lg:p-2.5 bg-gradient-to-br ${getProductColor(product)} bg-opacity-10 rounded-lg sm:rounded-xl flex-shrink-0`}>
                                                            {getProductIcon(product)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px]">
                                                                {product.name}
                                                            </p>
                                                            <span className="text-[8px] sm:text-[10px] lg:text-xs font-mono bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300 mt-0.5 inline-block">
                                                                #PROD-{String(product.id).padStart(6, '0')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                    <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                                        {product.unit}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                    <span className="text-xs sm:text-sm font-mono font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                                                        ₹{purchasePrice.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                    <span className="text-xs sm:text-sm font-mono font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                                        ₹{salePrice.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                        <span className={`text-xs sm:text-sm font-bold ${
                                                            margin > 0 ? 'text-emerald-600' : 'text-rose-600'
                                                        } whitespace-nowrap`}>
                                                            ₹{margin.toFixed(2)}
                                                        </span>
                                                        <span className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap self-start sm:self-auto ${
                                                            margin > 20 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                                            margin > 10 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                                        }`}>
                                                            {marginPercentage}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 text-right">
                                                    <div className="flex justify-end gap-1 sm:gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                                                        <Link
                                                            href={route('admin.products.edit', { product: product.id })}
                                                            className="p-1.5 sm:p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:text-gray-400 dark:hover:text-amber-400 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-200"
                                                            title="Edit Product"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                        {filteredProducts.map((product: any, index: number) => {
                            const purchasePrice = parseFloat(product.price_histories[0]?.purchase_price || 0);
                            const salePrice = parseFloat(product.price_histories[0]?.sale_price || 0);
                            const margin = salePrice - purchasePrice;
                            const marginPercentage = purchasePrice ? ((margin / purchasePrice) * 100).toFixed(1) : 0;
                            
                            return (
                                <div 
                                    key={product.id} 
                                    className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-xl hover:border-amber-200 dark:hover:border-amber-700 transition-shadow duration-300"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Premium Gradient Accent */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-400 dark:from-amber-600 dark:to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-xl sm:rounded-t-2xl" />
                                    
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-3xl" />
                                    </div>

                                    <div className="relative">
                                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                                            <div className="relative">
                                                <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br ${getProductColor(product)} flex items-center justify-center text-white border-2 border-white dark:border-gray-800 shadow-lg`}>
                                                    {getProductIcon(product)}
                                                </div>
                                            </div>
                                            
                                            <span className="text-[10px] sm:text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 sm:px-2.5 py-1 rounded-full text-gray-600 dark:text-gray-300 font-semibold">
                                                #PROD-{String(product.id).padStart(6, '0')}
                                            </span>
                                        </div>

                                        <div className="mb-3 sm:mb-4">
                                            <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-0.5 sm:mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate max-w-[200px] sm:max-w-[250px]">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
                                                    <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400" />
                                                </div>
                                                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Unit: {product.unit}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 sm:gap-4 py-3 sm:py-4 border-y border-gray-100 dark:border-gray-700 mb-3 sm:mb-4">
                                            <div className="min-w-0">
                                                <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                                                    Purchase Price
                                                </p>
                                                <div className="flex items-center gap-1 sm:gap-1.5">
                                                    <div className="p-1 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
                                                        <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400" />
                                                    </div>
                                                    <p className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400 truncate">
                                                        ₹{purchasePrice.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                                                    Sale Price
                                                </p>
                                                <div className="flex items-center gap-1 sm:gap-1.5">
                                                    <div className="p-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex-shrink-0">
                                                        <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <p className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 truncate">
                                                        ₹{salePrice.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <span className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400">Margin:</span>
                                                <span className={`text-xs sm:text-sm font-bold ${
                                                    margin > 0 ? 'text-emerald-600' : 'text-rose-600'
                                                }`}>
                                                    ₹{margin.toFixed(2)}
                                                </span>
                                                <span className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full ${
                                                    margin > 20 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                                    margin > 10 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                                }`}>
                                                    {marginPercentage}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link 
                                                href={route('admin.products.edit', { product: product.id })} 
                                                className="flex-1 text-center text-[10px] sm:text-xs font-bold py-2.5 sm:py-3 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 hover:from-amber-600 hover:to-amber-500 text-amber-700 dark:text-amber-300 hover:text-white rounded-lg sm:rounded-xl transition-all duration-200 uppercase tracking-wider"
                                            >
                                                Edit Product
                                            </Link>
                                        </div>

                                        {/* Price History Indicator */}
                                        {product.price_histories?.length > 1 && (
                                            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700">
                                                <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                                                <span className="truncate">Price updated {product.price_histories.length} times</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Premium Empty State - Mobile Responsive */}
                {filteredProducts.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 lg:p-12 text-center shadow-xl">
                        <div className="inline-flex p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                            <Droplets className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                            {searchTerm ? 'No products found' : 'No products registered yet'}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-2">
                            {searchTerm 
                                ? `No products match "${searchTerm}". Try a different search term.`
                                : 'Start managing your inventory by adding fuel types, lubricants, and other products.'}
                        </p>
                        {!searchTerm && (
                            <Link
                                href={route('admin.products.create')}
                                className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                            >
                                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Add Your First Product
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}