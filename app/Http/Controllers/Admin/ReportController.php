<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Purchase;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Payment;
use App\Models\Contra;
use App\Models\Expense;
use App\Models\PartyBankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SaleExport;
use App\Exports\PurchaseExport;
use App\Exports\CustomerExport;
use App\Exports\StockExport;
use App\Exports\PurchasePaymentExport;
use App\Exports\SalesPaymentExport;
use App\Exports\ContraExport;
use App\Exports\ExpenseExport;

class ReportController extends Controller
{
    private function getDateRange(Request $request)
    {
        $from = $request->from_date ?? now()->startOfMonth();
        $to = $request->to_date ?? now()->endOfDay();

        return [$from, $to];
    }

    public function index(Request $request)
    {
        [$from, $to] = $this->getDateRange($request);

        /*
        |--------------------------------------------------------------------------
        | SALES REPORT
        |--------------------------------------------------------------------------
        */

        $sales = Sale::with(['customer', 'vehicle'])
            ->whereBetween('sale_date', [$from, $to])
            ->get();

        /*
        |--------------------------------------------------------------------------
        | PURCHASE REPORT
        |--------------------------------------------------------------------------
        */

        $purchases = Purchase::with('party')
            ->whereBetween('purchase_date', [$from, $to])
            ->get();

        /*
        |--------------------------------------------------------------------------
        | CUSTOMER + VEHICLE REPORT
        |--------------------------------------------------------------------------
        */

        $customers = Customer::with(['vehicles', 'sales'])
            ->get();

        /*
        |--------------------------------------------------------------------------
        | STOCK REPORT
        |--------------------------------------------------------------------------
        */

        $stock = Product::select('products.id', 'products.name')
            ->leftJoin('stock_movements', 'products.id', '=', 'stock_movements.product_id')
            ->selectRaw('
                COALESCE(SUM(stock_movements.quantity_in),0) -
                COALESCE(SUM(stock_movements.quantity_out),0) as stock
            ')
            ->groupBy('products.id', 'products.name')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | PAYMENT REPORT
        |--------------------------------------------------------------------------
        */

        $payments = Payment::with([
                'companyBank',
                'payable.party',
                'counterparty'
            ])
            ->where('payable_type', Purchase::class)
            ->whereBetween('payment_date', [$from, $to])
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'payable_type' => 'PURCHASE',
                    'party' => optional($payment->payable)->party->name ?? '—',
                    'payment_mode' => $payment->payment_type,
                    'amount' => $payment->paid_amount,
                    'transaction_id' => $payment->transaction_reference_id,
                    'payment_date' => $payment->payment_date,
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | SALES PAYMENT REPORT
        |--------------------------------------------------------------------------
        */

        $salesPayments = Payment::with([
                'companyBank',
                'payable.customer',
                'counterparty'
            ])
            ->where('payable_type', Sale::class)
            ->whereBetween('payment_date', [$from, $to])
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'customer' => optional($payment->payable)->customer->name ?? '—',
                    'payment_mode' => $payment->payment_type,
                    'amount' => $payment->paid_amount,
                    'transaction_id' => $payment->transaction_reference_id,
                    'payment_date' => $payment->payment_date,
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | CONTRA REPORT
        |--------------------------------------------------------------------------
        */

        $contras = Contra::with(['fromBank', 'toBank'])
            ->whereBetween('transaction_date', [$from, $to])
            ->get();

        /*
        |--------------------------------------------------------------------------
        | EXPENSE REPORT
        |--------------------------------------------------------------------------
        */

        $expenses = Expense::with('bank')
            ->whereBetween('expense_date', [$from, $to])
            ->get();

        /*
        |--------------------------------------------------------------------------
        | EXPORT HANDLER
        |--------------------------------------------------------------------------
        */

        if ($request->export && $request->type) {

            return match ($request->type) {
                'sales' => Excel::download(new SaleExport($from, $to), 'sales-report.xlsx'),
                'purchases' => Excel::download(new PurchaseExport($from, $to), 'purchases-report.xlsx'),
                'customers' => Excel::download(new CustomerExport(), 'customers-report.xlsx'),
                'stock' => Excel::download(new StockExport(), 'stock-report.xlsx'),
                'payments' => Excel::download(new PurchasePaymentExport($from, $to), 'purchase-payments-report.xlsx'),
                'collections' => Excel::download(new SalesPaymentExport($from, $to), 'sales-payments-report.xlsx'),
                'contras' => Excel::download(new ContraExport($from, $to), 'contras-report.xlsx'),
                'expenses' => Excel::download(new ExpenseExport($from, $to), 'expenses-report.xlsx'),
                default => back(),
            };
        }

        /*
        |--------------------------------------------------------------------------
        | SINGLE PAGE RETURN
        |--------------------------------------------------------------------------
        */

        return Inertia::render('admin/reports/Reports', [

            'filters' => [
                'from' => $from,
                'to' => $to,
            ],

            'reports' => [
                'sales' => $sales,
                'purchases' => $purchases,
                'customers' => $customers,
                'stock' => $stock,
                'payments' => $payments,
                'collections' => $salesPayments,
                'contras' => $contras,
                'expenses' => $expenses,
            ],
        ]);
    }
}