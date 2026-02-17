<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductPriceHistory extends Model
{
    protected $fillable = [
        'product_id',
        'purchase_price',
        'sale_price',
        'effective_from',
        'effective_to',
        'is_active',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
