<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'product_id',
        'movement_type',
        'reference_id',
        'quantity_in',
        'quantity_out',
        'movement_date',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
