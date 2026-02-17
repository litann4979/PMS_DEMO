<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'customer_id',
        'vehicle_number',
        'vehicle_type',
        'is_active',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
