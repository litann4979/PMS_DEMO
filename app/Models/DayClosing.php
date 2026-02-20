<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DayClosing extends Model
{
    protected $fillable = [
        'closing_date',
        'opening_cash',
        'closing_cash',
        'closed_at',
        'shift_type',
    ];

    protected $casts = [
        'closing_date' => 'date',
        'opening_cash' => 'decimal:2',
        'closing_cash' => 'decimal:2',
        'closed_at'=>'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function breakdowns(): HasMany
    {
        return $this->hasMany(DayClosingBreakdown::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Helper Methods
    |--------------------------------------------------------------------------
    */

    public function getTotalDenominationsAttribute()
    {
        return $this->breakdowns->sum('total');
    }
}