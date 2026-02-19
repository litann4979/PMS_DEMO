<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pump extends Model
{
    protected $fillable = [
        'station_id',
        'pump_number',
        'is_active',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function station()
    {
        return $this->belongsTo(Station::class);
    }

    public function nozzles()
    {
        return $this->hasMany(Nozzle::class);
    }
}
