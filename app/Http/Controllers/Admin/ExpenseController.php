<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'expense_date' => 'required|date',
            'category'     => 'required|string|max:255',
            'amount'       => 'required|numeric|min:1',
            'payment_mode' => 'required|in:CASH,BANK',
            'bank_id'      => 'nullable|exists:banks,id',
            'remarks'      => 'nullable|string',
        ]);

        // If payment mode is BANK → bank_id must exist
        if ($validated['payment_mode'] === 'BANK' && empty($validated['bank_id'])) {
            return back()->withErrors([
                'bank_id' => 'Please select a bank account for bank payment.'
            ]);
        }

        return DB::transaction(function () use ($validated) {

            Expense::create([
                'expense_date' => $validated['expense_date'],
                'category'     => $validated['category'],
                'amount'       => $validated['amount'],
                'payment_mode' => $validated['payment_mode'],
                'bank_id'      => $validated['payment_mode'] === 'BANK'
                                    ? $validated['bank_id']
                                    : null,
                'remarks'      => $validated['remarks'] ?? null,
                'created_by'   => auth()->id(),
            ]);

            return redirect()
                ->route('admin.payments.index')
                ->with('success', 'Expense recorded successfully.');
        });
    }
}