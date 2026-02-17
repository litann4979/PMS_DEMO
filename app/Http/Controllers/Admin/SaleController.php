<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Customer;
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
            'sales' => Sale::with(['customer', 'vehicle'])->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/sales/Create', [
            'customers' => Customer::with('vehicles')->get(),
            'products' => Product::with(['priceHistories' => fn($q) => $q->where('is_active', true)])->get()
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
        ]);

        DB::transaction(function () use ($validated) {
            $totalAmount = collect($validated['items'])->sum(fn($i) => $i['quantity'] * $i['sale_price']);
            $invoiceNumber = 'INV-' . strtoupper(uniqid());

            $sale = Sale::create([
                'customer_id' => $validated['customer_id'],
                'vehicle_id' => $validated['vehicle_id'],
                'invoice_number' => $invoiceNumber,
                'sale_date' => $validated['sale_date'],
                'total_amount' => $totalAmount,
            ]);

            foreach ($validated['items'] as $item) {
                $sale->items()->create([
                    'product_id' => $item['product_id'],
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
        });

        return redirect()->route('admin.sales.index')->with('success', 'Sale completed.');
    }

   public function edit(Sale $sale)
    {
        return Inertia::render('admin/sales/Edit', [
            'sale' => $sale->load('items.product'),
            'customers' => Customer::with('vehicles')->get(),
            'products' => Product::with(['priceHistories' => fn($q) => $q->where('is_active', true)])->get()
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
        ]);

        DB::transaction(function () use ($validated, $sale) {
            // 1. Clear existing relations
            StockMovement::where('movement_type', 'SALE')
                ->where('reference_id', $sale->id)
                ->delete();
            
            $sale->items()->delete();

            // 2. Update Sale Header
            $totalAmount = collect($validated['items'])->sum(fn($i) => $i['quantity'] * $i['sale_price']);

            $sale->update([
                'customer_id' => $validated['customer_id'],
                'vehicle_id' => $validated['vehicle_id'],
                'sale_date' => $validated['sale_date'],
                'total_amount' => $totalAmount,
            ]);

            // 3. Re-insert Items and Stock Movements
            foreach ($validated['items'] as $item) {
                $sale->items()->create([
                    'product_id' => $item['product_id'],
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
        });

        return redirect()->route('admin.sales.index')->with('success', 'Sale invoice updated.');
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