<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartyBankAccount extends Model
{
    protected $fillable = [
        'party_id',
        'bank_name',
        'account_holder_name',
        'account_number',
        'ifsc_code',
        'micr_code',
        'branch',
        'is_default',
    ];

    public function party()
    {
        return $this->belongsTo(Party::class);
    }

    // Payments where this bank was used as counterparty
    public function payments()
    {
        return $this->morphMany(Payment::class, 'counterparty');
    }
}
