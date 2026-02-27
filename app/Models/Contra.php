<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contra extends Model
{
    protected $fillable = [
        'from_account_type',
        'to_account_type',
        'from_bank_id',
        'to_bank_id',
        'amount',
        'transaction_date',
        'remarks',
        'created_by',
    ];

    public function fromBank()
    {
        return $this->belongsTo(Bank::class, 'from_bank_id');
    }

    public function toBank()
    {
        return $this->belongsTo(Bank::class, 'to_bank_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
