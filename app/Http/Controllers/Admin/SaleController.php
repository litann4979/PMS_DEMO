<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/sales/Index', [
            'sales' => Sale::with(['customer', 'vehicle','items'])->latest()->get()
        ]);
    }
public function create()
{
    return Inertia::render('admin/sales/Create', [
        'customers' => Customer::with('vehicles')->get(),
        'products' => Product::with([
            'priceHistories' => fn($q) => $q->where('is_active', true)
        ])->get(),
        'nozzles' => \App\Models\Nozzle::with('product')->where('is_active', true)->get(), // 👈 ADD
    ]);
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'sale_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.1',
            'items.*.sale_price' => 'required|numeric',

            'paid_amount' => 'nullable|numeric|min:0',
'payment_method' => 'nullable|string',
'transaction_reference_id' => 'nullable|string',
'items.*.nozzle_id' => 'required|exists:nozzles,id',
        ]);

   DB::transaction(function () use ($validated) {

    $totalAmount = collect($validated['items'])
        ->sum(fn($i) => $i['quantity'] * $i['sale_price']);

    $paidAmount = isset($validated['paid_amount'])
        ? (float) $validated['paid_amount']
        : 0;

    // Safety Check
    if ($paidAmount > $totalAmount) {
        throw new \Exception("Paid amount cannot exceed total amount.");
    }

    $balanceAmount = $totalAmount - $paidAmount;

    $invoiceNumber = 'INV-' . strtoupper(uniqid());

    $sale = Sale::create([
        'customer_id' => $validated['customer_id'],
        'vehicle_id' => $validated['vehicle_id'],
        'invoice_number' => $invoiceNumber,
        'sale_date' => $validated['sale_date'],
        'total_amount' => $totalAmount,
        'paid_amount' => $paidAmount,
        'balance_amount' => $balanceAmount,
        'status' => $balanceAmount == 0
            ? 'PAID'
            : ($paidAmount > 0 ? 'PARTIALLY_PAID' : 'UNPAID'),
    ]);

    foreach ($validated['items'] as $item) {

        $sale->items()->create([
            'product_id' => $item['product_id'],
             'nozzle_id'  => $item['nozzle_id'], 
            'quantity' => $item['quantity'],
            'sale_price' => $item['sale_price'],
            'subtotal' => $item['quantity'] * $item['sale_price'],
        ]);

        StockMovement::create([
            'product_id' => $item['product_id'],
            'movement_type' => 'SALE',
            'reference_id' => $sale->id,
            'quantity_out' => $item['quantity'],
            'movement_date' => $validated['sale_date'],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Create Payment Record (Only If Paid)
    |--------------------------------------------------------------------------
    */
    if ($paidAmount > 0) {

        Payment::create([
            'payable_type' => Sale::class,
            'payable_id' => $sale->id,
            'paid_amount' => $paidAmount,
            'payment_type' => strtoupper($validated['payment_method'] ?? 'CASH'),
            'transaction_reference_id' => $validated['transaction_reference_id'] ?? null,
            'payment_date' => $validated['sale_date'],
            'status' => 'SUCCESS',
        ]);
    }
});



        return redirect()->route('admin.sales.index')->with('success', 'Sale completed.');
    }

 public function edit(Sale $sale)
{
    return Inertia::render('admin/sales/Edit', [
        'sale' => $sale->load([
            'items.product',
             'items.nozzle',
            'payments' // load payment history
        ]),
        'customers' => Customer::with('vehicles')->get(),
        'products' => Product::with([
            'priceHistories' => fn($q) => $q->where('is_active', true)
        ])->get(),
        'nozzles' => \App\Models\Nozzle::where('is_active', true)->get(), 
    ]);
}


 public function update(Request $request, Sale $sale)
{
    $validated = $request->validate([
        'customer_id' => 'required|exists:customers,id',
        'vehicle_id' => 'required|exists:vehicles,id',
        'sale_date' => 'required|date',
        'items' => 'required|array|min:1',
        'items.*.product_id' => 'required|exists:products,id',
        'items.*.quantity' => 'required|numeric|min:0.1',
        'items.*.sale_price' => 'required|numeric|min:0',
        'items.*.nozzle_id' => 'required|exists:nozzles,id',

        // NEW FIELDS
        'additional_payment' => 'nullable|numeric|min:0',
        'payment_method' => 'nullable|in:CASH,CARD,RTGS,UPI',
        'transaction_reference_id' => 'nullable|string|max:255',
    ]);

    DB::transaction(function () use ($validated, $sale) {

        /*
        |--------------------------------------------------------------------------
        | 1️⃣ Remove Old Stock Movements & Items
        |--------------------------------------------------------------------------
        */
        StockMovement::where('movement_type', 'SALE')
            ->where('reference_id', $sale->id)
            ->delete();

        $sale->items()->delete();

        /*
        |--------------------------------------------------------------------------
        | 2️⃣ Recalculate Total Amount
        |--------------------------------------------------------------------------
        */
        $totalAmount = collect($validated['items'])
            ->sum(fn($i) => $i['quantity'] * $i['sale_price']);

        /*
        |--------------------------------------------------------------------------
        | 3️⃣ Update Sale Header (Customer, Vehicle, Date, Total)
        |--------------------------------------------------------------------------
        */
        $sale->update([
            'customer_id' => $validated['customer_id'],
            'vehicle_id' => $validated['vehicle_id'],
            'sale_date' => $validated['sale_date'],
            'total_amount' => $totalAmount,
        ]);

        /*
        |--------------------------------------------------------------------------
        | 4️⃣ Reinsert Items + Stock Movements
        |--------------------------------------------------------------------------
        */
        foreach ($validated['items'] as $item) {

            $sale->items()->create([
                'product_id' => $item['product_id'],
               'nozzle_id'  => $item['nozzle_id'] ?? null,
                'quantity' => $item['quantity'],
                'sale_price' => $item['sale_price'],
                'subtotal' => $item['quantity'] * $item['sale_price'],
            ]);

            StockMovement::create([
                'product_id' => $item['product_id'],
                'movement_type' => 'SALE',
                'reference_id' => $sale->id,
                'quantity_out' => $item['quantity'],
                'movement_date' => \Carbon\Carbon::parse($validated['sale_date'])->format('Y-m-d'),
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | 5️⃣ Handle Additional Payment (If Any)
        |--------------------------------------------------------------------------
        */

        $additionalPayment = (float) ($validated['additional_payment'] ?? 0);

        if ($additionalPayment > 0) {

            if ($additionalPayment > $sale->balance_amount) {
                throw new \Exception("Payment exceeds remaining balance.");
            }

            // Create Payment Entry
            Payment::create([
                'payable_type' => Sale::class,
                'payable_id' => $sale->id,
                'paid_amount' => $additionalPayment,
                'payment_type' => $validated['payment_method'] ?? 'CASH',
                'transaction_reference_id' => $validated['transaction_reference_id'] ?? null,
                'payment_date' => now(),
                'status' => 'SUCCESS',
            ]);

            // Update Financial Fields
            $sale->increment('paid_amount', $additionalPayment);
            $sale->decrement('balance_amount', $additionalPayment);
        }

        /*
        |--------------------------------------------------------------------------
        | 6️⃣ Recalculate Balance If Total Changed
        |--------------------------------------------------------------------------
        */

        $newBalance = $sale->total_amount - $sale->paid_amount;

        $sale->update([
            'balance_amount' => $newBalance,
            'status' => $newBalance == 0
                ? 'PAID'
                : ($sale->paid_amount > 0 ? 'PARTIALLY_PAID' : 'UNPAID'),
        ]);
    });

    return redirect()
        ->route('admin.sales.index')
        ->with('success', 'Sale invoice updated successfully.');
}


    public function destroy(Sale $sale)
    {
        DB::transaction(function () use ($sale) {
            StockMovement::where('movement_type', 'SALE')
                ->where('reference_id', $sale->id)
                ->delete();
                
            $sale->items()->delete();
            $sale->delete();
        });

        return redirect()->route('admin.sales.index')->with('success', 'Sale deleted and stock restored.');
    }
}