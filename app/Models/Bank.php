<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    protected $fillable = [
        'bank_name',
        'account_number',
        'ifsc_code',
        'account_holder_name',
        'micr_code',
        'branch',
    ];

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function outgoingPayments()
{
    return $this->hasMany(Payment::class, 'company_bank_id');
}

}
