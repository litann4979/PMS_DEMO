<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'mobile',
        'email',
        'address',
        'gst_number',
        'company_name',
    ];

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function bankAccounts()
{
    return $this->hasMany(CustomerBankAccount::class);
}

}
