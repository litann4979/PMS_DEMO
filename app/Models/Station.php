<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Station extends Model
{
    protected $fillable = [
        'name',
        'code',
        'location',
        'is_active',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function pumps()
    {
        return $this->hasMany(Pump::class);
    }

    public function salesPersons()
    {
        return $this->hasMany(SalesPerson::class);
    }
}
