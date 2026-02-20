<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentHistory extends Model
{
    protected $fillable = [
        'payment_id',
        'bank_type',
        'old_paid_amount',
        'new_paid_amount',
        'old_status',
        'new_status',
        'updated_by',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /*
    |--------------------------------------------------------------------------
    | Casting (Recommended)
    |--------------------------------------------------------------------------
    */

    protected $casts = [
        'old_paid_amount' => 'decimal:2',
        'new_paid_amount' => 'decimal:2',
    ];
}
