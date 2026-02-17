<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'reference_type',
        'reference_id',
        'party_id',
        'customer_id',
        'payment_type',
        'bank_id', // old (can remove later)
        'company_bank_id',
        'counterparty_bank_id',
        'counterparty_type',
        'amount',
        'payment_date',
        'remarks',
        'transaction_ref',
    ];

    /*
    |--------------------------------------------------------------------------
    | Reference Relations
    |--------------------------------------------------------------------------
    */

    public function purchase()
    {
        return $this->belongsTo(Purchase::class, 'reference_id')
            ->where('reference_type', 'PURCHASE');
    }

    public function sale()
    {
        return $this->belongsTo(Sale::class, 'reference_id')
            ->where('reference_type', 'SALE');
    }

    /*
    |--------------------------------------------------------------------------
    | Direct Party / Customer
    |--------------------------------------------------------------------------
    */

    public function party()
    {
        return $this->belongsTo(Party::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
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
}
