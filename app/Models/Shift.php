<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{



    protected $fillable = [
        'sales_person_id',
        'nozzle_id',
        'start_meter',
        'end_meter',
        'total_quantity',
        'total_amount',
        'shift_start',
        'shift_end',
    ];

    protected $casts = [
        'start_meter' => 'decimal:2',
        'end_meter' => 'decimal:2',
        'total_quantity' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'shift_start' => 'datetime',
        'shift_end' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function salesPerson()
    {
        return $this->belongsTo(SalesPerson::class);
    }

    public function nozzle()
    {
        return $this->belongsTo(Nozzle::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getProductAttribute()
    {
        return $this->nozzle?->product;
    }

    public function getStationAttribute()
    {
        return $this->nozzle?->pump?->station;
    }
}
