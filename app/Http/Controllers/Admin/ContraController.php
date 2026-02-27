<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contra;
use Illuminate\Http\Request;

class ContraController extends Controller
{
   public function store(Request $request)
{
    $validated = $request->validate([
        'from_account_type' => 'required|in:CASH,BANK',
        'to_account_type'   => 'required|in:CASH,BANK',
        'from_bank_id'      => 'nullable|exists:banks,id',
        'to_bank_id'        => 'nullable|exists:banks,id',
        'amount'            => 'required|numeric|min:1',
        'transaction_date'  => 'required|date',
        'remarks'           => 'nullable|string',
    ]);

    Contra::create([
        ...$validated,
        'created_by' => auth()->id(),
    ]);

    return back()->with('success', 'Contra entry recorded successfully.');
}
}
