<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesPerson extends Model
{
    protected $table = 'sales_persons';
    
    protected $fillable = [
        'station_id',
        'name',
        'mobile',
        'employee_code',
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

    public function shifts()
    {
        return $this->hasMany(Shift::class);
    }
}
