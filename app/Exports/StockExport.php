<?php

namespace App\Exports;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class StockExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    public function collection()
    {
        return Product::select('products.id', 'products.name')
            ->leftJoin('stock_movements', 'products.id', '=', 'stock_movements.product_id')
            ->selectRaw('
                COALESCE(SUM(stock_movements.quantity_in),0) -
                COALESCE(SUM(stock_movements.quantity_out),0) as stock
            ')
            ->groupBy('products.id', 'products.name')
            ->get()
            ->map(function ($product) {
                return [
                    'Product'       => $product->name,
                    'Current Stock' => $product->stock,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Product',
            'Current Stock',
        ];
    }
}
