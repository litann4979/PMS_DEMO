<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nozzle extends Model
{
    protected $fillable = [
        'pump_id',
        'product_id',
        'nozzle_number',
        'current_meter_reading',
        'is_active',
    ];

    protected $casts = [
        'current_meter_reading' => 'decimal:2',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function pump()
    {
        return $this->belongsTo(Pump::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function shifts()
    {
        return $this->hasMany(Shift::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Helper
    |--------------------------------------------------------------------------
    */

    public function station()
    {
        return $this->pump->station;
    }
}
