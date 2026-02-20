<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\Product;
use App\Models\Party;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/purchases/Index', [
            'purchases' => Purchase::with('party')->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/purchases/Create', [
            'parties' => Party::all(),
            'products' => Product::with(['priceHistories' => fn($q) => $q->where('is_active', true)])->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'party_id' => 'required|exists:parties,id',
            'purchase_date' => 'required|date',
            'bill_number' => 'nullable|string',
            'reference_number' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.1',
            'items.*.purchase_price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $totalAmount = collect($validated['items'])->sum(fn($item) => $item['quantity'] * $item['purchase_price']);

            $purchase = Purchase::create([
                'party_id' => $validated['party_id'],
                'purchase_date' => $validated['purchase_date'],
                'bill_number' => $validated['bill_number'],
                'reference_number' => $validated['reference_number'],
                'total_amount' => $totalAmount,
            ]);

            foreach ($validated['items'] as $item) {
                $subtotal = $item['quantity'] * $item['purchase_price'];
                
                $purchase->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'purchase_price' => $item['purchase_price'],
                    'subtotal' => $subtotal,
                ]);

                StockMovement::create([
                    'product_id' => $item['product_id'],
                    'movement_type' => 'PURCHASE',
                    'reference_id' => $purchase->id,
                    'quantity_in' => $item['quantity'],
                    'movement_date' => Carbon::parse($validated['purchase_date'])->format('Y-m-d'),
                ]);
            }
        });

        return redirect()->route('admin.purchases.index')->with('success', 'Purchase recorded and stock updated.');
    }
    public function edit(Purchase $purchase)
    {
        return Inertia::render('admin/purchases/Edit', [
            'purchase' => $purchase->load('items.product'),
            'parties' => Party::select('id', 'name')->get(),
            'products' => Product::with(['priceHistories' => fn($q) => $q->where('is_active', true)])->get()
        ]);
    }

    public function update(Request $request, Purchase $purchase)
    {
        $validated = $request->validate([
            'party_id' => 'required|exists:parties,id',
            'purchase_date' => 'required|date',
            'bill_number' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.1',
            'items.*.purchase_price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $purchase) {
            // 1. Remove old stock movements and items to prevent duplicates/orphans
            StockMovement::where('movement_type', 'PURCHASE')
                ->where('reference_id', $purchase->id)
                ->delete();
            
            $purchase->items()->delete();

            // 2. Update Purchase Header
            $totalAmount = collect($validated['items'])->sum(fn($item) => $item['quantity'] * $item['purchase_price']);

            
        $paidAmount = $purchase->paid_amount ?? 0;
        $balanceAmount = $totalAmount - $paidAmount;

        // Prevent negative balance
        if ($balanceAmount < 0) {
            $balanceAmount = 0;
        }

            
            $purchase->update([
                'party_id' => $validated['party_id'],
                'purchase_date' => $validated['purchase_date'],
                'bill_number' => $validated['bill_number'],
                'total_amount' => $totalAmount,
                'balance_amount' => $balanceAmount,
            'status' => $balanceAmount == 0
                ? 'PAID'
                : ($paidAmount > 0 ? 'PARTIALLY_PAID' : 'UNPAID'),
        ]);

            // 3. Re-insert Items and Stock Movements
            foreach ($validated['items'] as $item) {
                $purchase->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'purchase_price' => $item['purchase_price'],
                    'subtotal' => $item['quantity'] * $item['purchase_price'],
                ]);

                StockMovement::create([
                    'product_id' => $item['product_id'],
                    'movement_type' => 'PURCHASE',
                    'reference_id' => $purchase->id,
                    'quantity_in' => $item['quantity'],
                    'movement_date' => Carbon::parse($validated['purchase_date'])->format('Y-m-d'),
                ]);
            }
        });

        return redirect()->route('admin.purchases.index')->with('success', 'Purchase updated and stock adjusted.');
    }

    public function destroy(Purchase $purchase)
    {
        DB::transaction(function () use ($purchase) {
            StockMovement::where('movement_type', 'PURCHASE')
                ->where('reference_id', $purchase->id)
                ->delete();
                
            $purchase->items()->delete();
            $purchase->delete();
        });

        return redirect()->route('admin.purchases.index')->with('success', 'Purchase deleted and stock reverted.');
    }
}