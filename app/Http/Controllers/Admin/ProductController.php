<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductPriceHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/products/index', [
            'products' => Product::with(['priceHistories' => function($query) {
                $query->where('is_active', true);
            }])->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/products/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:20',
            'purchase_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $product = Product::create([
                'name' => $validated['name'],
                'unit' => $validated['unit'],
            ]);

            ProductPriceHistory::create([
                'product_id' => $product->id,
                'purchase_price' => $validated['purchase_price'],
                'sale_price' => $validated['sale_price'],
                'effective_from' => now(),
                'is_active' => true,
            ]);
        });

        return redirect()->route('admin.products.index')->with('success', 'Product and initial pricing created.');
    }

    public function edit(Product $product)
    {
        return Inertia::render('admin/products/edit', [
            'product' => $product->load(['priceHistories' => function($query) {
                $query->where('is_active', true);
            }])
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:20',
            'purchase_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $product) {
            $product->update([
                'name' => $validated['name'],
                'unit' => $validated['unit'],
            ]);

            $currentPrice = $product->priceHistories()->where('is_active', true)->first();

            // Only create new history if prices actually changed
            if ($currentPrice->purchase_price != $validated['purchase_price'] || 
                $currentPrice->sale_price != $validated['sale_price']) {
                
                $currentPrice->update(['is_active' => false, 'effective_to' => now()]);

                ProductPriceHistory::create([
                    'product_id' => $product->id,
                    'purchase_price' => $validated['purchase_price'],
                    'sale_price' => $validated['sale_price'],
                    'effective_from' => now(),
                    'is_active' => true,
                ]);
            }
        });

        return redirect()->route('admin.products.index')->with('success', 'Product updated.');
    }
}