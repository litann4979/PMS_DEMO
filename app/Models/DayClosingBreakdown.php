<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DayClosingBreakdown extends Model
{
    protected $fillable = [
        'day_closing_id',
        'denomination',
        'count',
        'total',
    ];

    protected $casts = [
        'denomination' => 'integer',
        'count' => 'integer',
        'total' => 'decimal:2',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function dayClosing(): BelongsTo
    {
        return $this->belongsTo(DayClosing::class);
    }
}