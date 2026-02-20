<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\PaymentHistory;

class Payment extends Model
{
    protected $fillable = [
        'payable_type',
        'payable_id',
        'paid_amount',
        'payment_type',
        'transaction_reference_id',
        'status',
        'company_bank_id',
        'counterparty_type',
        'counterparty_id',
        'payment_date',
        'remarks',
    ];

    protected $casts = [
        'paid_amount' => 'decimal:2',
        'payment_date' => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | Polymorphic Relation (SALE or PURCHASE)
    |--------------------------------------------------------------------------
    */

    public function payable()
    {
        return $this->morphTo();
    }

    /*
    |--------------------------------------------------------------------------
    | Company Bank (Our Bank)
    |--------------------------------------------------------------------------
    */

    public function companyBank()
    {
        return $this->belongsTo(Bank::class, 'company_bank_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Counterparty Bank (Supplier or Customer Bank)
    |--------------------------------------------------------------------------
    */

    public function counterparty()
    {
        return $this->morphTo();
    }

    /*
    |--------------------------------------------------------------------------
    | Payment History
    |--------------------------------------------------------------------------
    */

    public function histories()
    {
        return $this->hasMany(PaymentHistory::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Auto Audit Logging on Update
    |--------------------------------------------------------------------------
    */

    protected static function booted()
{
    // On Update
    static::updating(function ($payment) {

        PaymentHistory::create([
            'payment_id' => $payment->id,
            'old_paid_amount' => $payment->getOriginal('paid_amount'),
            'new_paid_amount' => $payment->paid_amount,
            'old_status' => $payment->getOriginal('status'),
            'new_status' => $payment->status,
            'updated_by' => auth()->id(),
        ]);
    });

    // On Create
    static::created(function ($payment) {

        PaymentHistory::create([
            'payment_id' => $payment->id,
            'old_paid_amount' => null,
            'new_paid_amount' => $payment->paid_amount,
            'old_status' => null,
            'new_status' => $payment->status,
            'updated_by' => auth()->id(),
        ]);
    });
}

}
