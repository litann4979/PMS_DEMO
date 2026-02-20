<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'customer_id',
        'vehicle_id',
        'invoice_number',
        'total_amount',
        'paid_amount',
        'balance_amount',
        'status',
        'sale_date',
    ];

    protected $casts = [
        'total_amount'   => 'decimal:2',
        'paid_amount'    => 'decimal:2',
        'balance_amount' => 'decimal:2',
        'sale_date'      => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function payments()
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    /*
    |--------------------------------------------------------------------------
    | Helper Methods (Recommended)
    |--------------------------------------------------------------------------
    */

    public function isPaid()
    {
        return $this->status === 'PAID';
    }

    public function isPartiallyPaid()
    {
        return $this->status === 'PARTIALLY_PAID';
    }

    public function isUnpaid()
    {
        return $this->status === 'UNPAID';
    }
}
