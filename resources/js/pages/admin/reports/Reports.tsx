import { Head, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { useState } from 'react'
import {
    FileSpreadsheet, Filter, Download, Calendar,
    ShoppingCart, Package, Users, Layers, CreditCard,
    ArrowLeftRight, Receipt, TrendingUp, Search
} from 'lucide-react'

interface Props {
    filters: {
        from: string
        to: string
    }
    reports: any
}

// ─── Column definition type ──────────────────────────────
type Column = {
    key: string
    label: string
    render?: (row: any) => React.ReactNode
    align?: 'left' | 'right' | 'center'
    className?: string
}

// ─── Formatters ──────────────────────────────────────────
const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value || 0)

const formatDate = (dateStr: string) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusBadge = (status: string) => {
    const s = (status || '').toUpperCase().replace(/_/g, ' ')
    const color =
        s === 'PAID' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' :
            s === 'PARTIALLY PAID' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                s === 'UNPAID' ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800' :
                    'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${color}`}>
            {s}
        </span>
    )
}

// ─── Per-tab column configs ──────────────────────────────
const tabColumns: Record<string, Column[]> = {
    sales: [
        { key: 'id', label: '#', align: 'center' },
        { key: 'customer', label: 'Customer', render: (r) => r.customer?.name || 'Walk-in' },
        { key: 'vehicle', label: 'Vehicle', render: (r) => r.vehicle?.vehicle_number || '—' },
        { key: 'invoice_number', label: 'Invoice' },
        { key: 'total_amount', label: 'Total', align: 'right', render: (r) => formatCurrency(r.total_amount) },
        { key: 'paid_amount', label: 'Paid', align: 'right', render: (r) => formatCurrency(r.paid_amount) },
        { key: 'balance_amount', label: 'Balance', align: 'right', render: (r) => formatCurrency(r.balance_amount) },
        { key: 'status', label: 'Status', align: 'center', render: (r) => statusBadge(r.status) },
        { key: 'sale_date', label: 'Date', render: (r) => formatDate(r.sale_date) },
    ],
    purchases: [
        { key: 'id', label: '#', align: 'center' },
        { key: 'party', label: 'Supplier', render: (r) => r.party?.name || '—' },
        { key: 'bill_number', label: 'Bill Number' },
        { key: 'total_amount', label: 'Total', align: 'right', render: (r) => formatCurrency(r.total_amount) },
        { key: 'paid_amount', label: 'Paid', align: 'right', render: (r) => formatCurrency(r.paid_amount) },
        { key: 'balance_amount', label: 'Balance', align: 'right', render: (r) => formatCurrency(r.balance_amount) },
        { key: 'status', label: 'Status', align: 'center', render: (r) => statusBadge(r.status) },
        { key: 'purchase_date', label: 'Date', render: (r) => formatDate(r.purchase_date) },
    ],
    customers: [
        { key: 'id', label: '#', align: 'center' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'mobile', label: 'Mobile' },
        { key: 'address', label: 'Address' },
        { key: 'gst_number', label: 'GST' },
        {
            key: 'vehicles', label: 'Vehicles', render: (r) => {
                const vehicles = r.vehicles || []
                if (vehicles.length === 0) return '—'
                return vehicles.map((v: any) => v.vehicle_number).join(', ')
            }
        },
        { key: 'sales_count', label: 'Total Sales', align: 'center', render: (r) => r.sales?.length || 0 },
    ],
    stock: [
        { key: 'id', label: '#', align: 'center' },
        { key: 'name', label: 'Product' },
        {
            key: 'stock', label: 'Current Stock', align: 'right', render: (r) => {
                const stock = Number(r.stock || 0)
                const color = stock < 50 ? 'text-rose-600 font-bold' : stock < 100 ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'
                return <span className={color}>{new Intl.NumberFormat('en-IN').format(stock)}</span>
            }
        },
    ],
    payments: [
        { key: 'id', label: '#', align: 'center' },
        { key: 'payable_type', label: 'Payable Type' },
        { key: 'party', label: 'Party Name' },
        { key: 'payment_mode', label: 'Payment Mode' },
        { key: 'amount', label: 'Amount', align: 'right', render: (r) => formatCurrency(r.amount) },
        { key: 'transaction_id', label: 'Transaction ID' },
        { key: 'payment_date', label: 'Date', render: (r) => formatDate(r.payment_date) },
    ],
    collections: [
        { key: 'id', label: '#', align: 'center' },
        { key: 'customer', label: 'Customer Name' },
        { key: 'payment_mode', label: 'Payment Mode' },
        { key: 'amount', label: 'Amount', align: 'right', render: (r) => formatCurrency(r.amount) },
        { key: 'transaction_id', label: 'Transaction ID' },
        { key: 'payment_date', label: 'Date', render: (r) => formatDate(r.payment_date) },
    ],
    contras: [
        { key: 'id', label: '#', align: 'center' },
        { key: 'from_bank', label: 'From', render: (r) => r.from_bank?.bank_name || r.from_account_type || '—' },
        { key: 'to_bank', label: 'To', render: (r) => r.to_bank?.bank_name || r.to_account_type || '—' },
        { key: 'amount', label: 'Amount', align: 'right', render: (r) => formatCurrency(r.amount) },
        { key: 'remarks', label: 'Remarks' },
        { key: 'transaction_date', label: 'Date', render: (r) => formatDate(r.transaction_date) },
    ],
    expenses: [
        { key: 'id', label: '#', align: 'center' },
        { key: 'category', label: 'Category' },
        { key: 'payment_mode', label: 'Payment Mode' },
        { key: 'amount', label: 'Amount', align: 'right', render: (r) => formatCurrency(r.amount) },
        { key: 'bank', label: 'Bank', render: (r) => r.bank?.bank_name || r.payment_mode || '—' },
        { key: 'remarks', label: 'Remarks' },
        { key: 'expense_date', label: 'Date', render: (r) => formatDate(r.expense_date) },
    ],
}

const tabMeta: Record<string, { icon: any; color: string; amountKey: string }> = {
    sales: { icon: ShoppingCart, color: 'blue', amountKey: 'total_amount' },
    purchases: { icon: Package, color: 'emerald', amountKey: 'total_amount' },
    customers: { icon: Users, color: 'purple', amountKey: '' },
    stock: { icon: Layers, color: 'amber', amountKey: '' },
    payments: { icon: CreditCard, color: 'blue', amountKey: 'amount' },
    collections: { icon: TrendingUp, color: 'emerald', amountKey: 'amount' },
    contras: { icon: ArrowLeftRight, color: 'purple', amountKey: 'amount' },
    expenses: { icon: Receipt, color: 'rose', amountKey: 'amount' },
}

export default function Reports({ filters, reports }: Props) {

    const [activeTab, setActiveTab] = useState('sales')
    const [fromDate, setFromDate] = useState(filters.from?.split('T')[0] || '')
    const [toDate, setToDate] = useState(filters.to?.split('T')[0] || '')

    const handleFilter = () => {
        router.get(route('admin.reports.index'), {
            from_date: fromDate,
            to_date: toDate,
        }, { preserveState: true })
    }

    const handleExport = () => {
        window.location.href =
            route('admin.reports.index') +
            `?from_date=${fromDate}&to_date=${toDate}&type=${activeTab}&export=1`
    }

    const tabs = Object.keys(tabColumns)
    const data = reports[activeTab] || []
    const columns = tabColumns[activeTab] || []
    const meta = tabMeta[activeTab]

    const totalAmount = meta?.amountKey
        ? data.reduce((acc: number, item: any) => acc + Number(item[meta.amountKey] || 0), 0)
        : null

    const TabIcon = meta?.icon || FileSpreadsheet

    return (
        <AppLayout>
            <Head title="Reports" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
                <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">

                    {/* Header */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-2xl blur-xl" />
                        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-xl">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl blur-xl opacity-60 animate-pulse" />
                                        <div className="relative p-3 bg-white dark:bg-gray-800 rounded-xl">
                                            <FileSpreadsheet className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                                            Business Reports
                                        </h1>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Analyze your business data with detailed reports
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-lg">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 flex flex-wrap items-end gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 mr-1">
                                        <Calendar className="w-4 h-3 text-gray-400" />
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Date Range</span>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">From</label>
                                        <input
                                            type="date"
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                            className="border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">To</label>
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    />
                                </div>
                                <button
                                    onClick={handleFilter}
                                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
                                >
                                    <Filter className="w-4 h-4" />
                                    Apply
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
                                >
                                    <Download className="w-4 h-4" />
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 flex-wrap">
                        {tabs.map((tab) => {
                            const tm = tabMeta[tab]
                            const Icon = tm?.icon || FileSpreadsheet
                            const isActive = activeTab === tab
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${isActive
                                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 scale-105'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:scale-105 hover:shadow-md'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab}
                                </button>
                            )
                        })}
                    </div>

                    {/* Summary Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 bg-gradient-to-r from-${meta?.color || 'amber'}-500 to-${meta?.color || 'amber'}-600 rounded-xl text-white`}>
                                    <TabIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                                        {activeTab} Report
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {data.length} {data.length === 1 ? 'record' : 'records'} found
                                    </p>
                                </div>
                            </div>
                            {totalAmount !== null && (
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Amount</p>
                                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(totalAmount)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                        {columns.map((col) => (
                                            <th
                                                key={col.key}
                                                className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${col.align === 'right' ? 'text-right' :
                                                    col.align === 'center' ? 'text-center' : 'text-left'
                                                    }`}
                                            >
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {data.map((row: any, index: number) => (
                                        <tr
                                            key={row.id || index}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                                        >
                                            {columns.map((col) => (
                                                <td
                                                    key={col.key}
                                                    className={`px-4 py-3 text-gray-700 dark:text-gray-300 ${col.align === 'right' ? 'text-right' :
                                                        col.align === 'center' ? 'text-center' : 'text-left'
                                                        } ${col.className || ''}`}
                                                >
                                                    {col.render
                                                        ? col.render(row)
                                                        : (row[col.key] ?? '—')}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}

                                    {data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={columns.length}
                                                className="px-4 py-16 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <Search className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                                    <p className="text-gray-500 dark:text-gray-400 font-medium">No data available</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">Try adjusting the date range</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    )
}