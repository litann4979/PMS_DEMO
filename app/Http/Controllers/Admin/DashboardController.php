<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Purchase;
use App\Models\Expense;
use App\Models\Contra;
use App\Models\DayClosing;
use App\Models\Payment;
use App\Models\Shift;
use App\Models\Product;
use App\Models\SaleItem;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->input('period', 'today');

        // Compute date range based on period
        switch ($period) {
            case 'week':
                $startDate = now()->startOfWeek();
                $endDate = now()->endOfDay();
                break;
            case 'month':
                $startDate = now()->startOfMonth();
                $endDate = now()->endOfDay();
                break;
            default: // 'today'
                $startDate = now()->startOfDay();
                $endDate = now()->endOfDay();
                break;
        }

        /*
        |--------------------------------------------------------------------------
        | 1. EXECUTIVE KPI
        |--------------------------------------------------------------------------
        */

        $periodSales = Sale::whereBetween('sale_date', [$startDate, $endDate])
            ->selectRaw('COUNT(*) as bills, SUM(total_amount) as revenue')
            ->first();

        $periodExpenses = Expense::whereBetween('expense_date', [$startDate, $endDate])->sum('amount');

        $periodProfit = ($periodSales->revenue ?? 0) - $periodExpenses;

        /*
        |--------------------------------------------------------------------------
        | 2. BANK & CASH POSITION
        |--------------------------------------------------------------------------
        */

        $bankBalance = Payment::whereNotNull('company_bank_id')
            ->where('status', 'SUCCESS')
            ->sum('paid_amount');

        $cashInHand = DayClosing::latest()->value('closing_cash') ?? 0;

        $periodCashCollection = Payment::whereBetween('payment_date', [$startDate, $endDate])
            ->sum('paid_amount');

        /*
        |--------------------------------------------------------------------------
        | 3. OUTSTANDING BREAKDOWN
        |--------------------------------------------------------------------------
        */

        $customerOutstanding = Sale::sum('balance_amount');
        $partyOutstanding = Purchase::sum('balance_amount');

        /*
        |--------------------------------------------------------------------------
        | 4. SHIFT PERFORMANCE
        |--------------------------------------------------------------------------
        */

        $periodShifts = Shift::whereBetween('shift_start', [$startDate, $endDate])->get();

        $avgShiftSale = $periodShifts->avg('total_amount');

        $topSalesPerson = Shift::whereBetween('shift_start', [$startDate, $endDate])
            ->select('sales_person_id', DB::raw('SUM(total_amount) as total'))
            ->groupBy('sales_person_id')
            ->orderByDesc('total')
            ->with('salesPerson')
            ->first();

        /*
        |--------------------------------------------------------------------------
        | 5. PRODUCT PERFORMANCE
        |--------------------------------------------------------------------------
        */

        $topProducts = SaleItem::join('products', 'products.id', '=', 'sale_items.product_id')
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->whereBetween('sales.sale_date', [$startDate, $endDate])
            ->select('products.name',
                DB::raw('SUM(sale_items.quantity) as liters'),
                DB::raw('SUM(sale_items.subtotal) as revenue')
            )
            ->groupBy('products.name')
            ->orderByDesc('revenue')
            ->take(5)
            ->get();

       /*
|--------------------------------------------------------------------------
| 6. STOCK LEVELS (CORRECTED)
|--------------------------------------------------------------------------
*/

$stockLevels = Product::select('products.id', 'products.name')
    ->leftJoin('stock_movements', 'products.id', '=', 'stock_movements.product_id')
    ->selectRaw('
        COALESCE(SUM(stock_movements.quantity_in), 0) as total_added,
        COALESCE(SUM(stock_movements.quantity_out), 0) as total_sold,
        COALESCE(SUM(stock_movements.quantity_in), 0) -
        COALESCE(SUM(stock_movements.quantity_out), 0) as remaining_stock
    ')
    ->groupBy('products.id', 'products.name')
    ->get();

        /*
        |--------------------------------------------------------------------------
        | 7. PAYMENT MODE SPLIT
        |--------------------------------------------------------------------------
        */

        $paymentModes = Payment::whereBetween('payment_date', [$startDate, $endDate])
            ->select('payment_type', DB::raw('SUM(paid_amount) as total'))
            ->groupBy('payment_type')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | 8. 30 DAYS TREND
        |--------------------------------------------------------------------------
        */

        $last30Days = Sale::whereDate('sale_date', '>=', now()->subDays(29))
            ->selectRaw('DATE(sale_date) as date, SUM(total_amount) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();


            /*
|--------------------------------------------------------------------------
| 9. RECENT ACTIVITIES
|--------------------------------------------------------------------------
*/

// Recent Sales (last 5)
$recentSales = Sale::with(['customer'])
    ->latest('sale_date')
    ->take(5)
    ->get();

// Recent Purchases (last 5)
$recentPurchases = Purchase::with(['party'])
    ->latest('purchase_date')
    ->take(5)
    ->get();

// Recently Added Products (last 5)
$recentProducts = Product::latest()
    ->take(5)
    ->get();

        return Inertia::render('dashboard', [

            'period' => $period,

            'executive_kpi' => [
                'today_revenue' => $periodSales->revenue ?? 0,
                'today_bills' => $periodSales->bills ?? 0,
                'today_profit' => $periodProfit,
            ],

            'bank_position' => [
                'bank_balance' => $bankBalance,
                'cash_in_hand' => $cashInHand,
                'today_cash_collection' => $periodCashCollection,
            ],

            'outstanding' => [
                'customer' => $customerOutstanding,
                'party' => $partyOutstanding,
            ],

            'shift_performance' => [
                'avg_sale' => $avgShiftSale,
                'top_sales_person' => $topSalesPerson,
            ],

            'fuel_performance' => $topProducts,
            'stock_levels' => $stockLevels,
            'payment_mode_split' => $paymentModes,
            'sales_trend_30_days' => $last30Days,

            'recent_sales' => $recentSales,
'recent_purchases' => $recentPurchases,
'recent_products' => $recentProducts,
        ]);
    }
}