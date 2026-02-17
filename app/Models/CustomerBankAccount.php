<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerBankAccount extends Model
{
    protected $fillable = [
        'customer_id',
        'bank_name',
        'account_holder_name',
        'account_number',
        'ifsc_code',
        'micr_code',
        'branch',
        'is_default',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function payments()
    {
        return $this->morphMany(Payment::class, 'counterparty');
    }
}
