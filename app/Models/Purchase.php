<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'party_id',
        'reference_number',
        'bill_number',
        'total_amount',
        'purchase_date',
    ];

    public function party()
    {
        return $this->belongsTo(Party::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'reference_id')
                    ->where('reference_type', 'PURCHASE');
    }
}
