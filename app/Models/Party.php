<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Party extends Model
{
    protected $fillable = [
        'name',
        'email',
        'mobile',
        'address',
        'gst_number',
    ];

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function bankAccounts()
{
    return $this->hasMany(PartyBankAccount::class);
}

}
