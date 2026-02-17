<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BankController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/banks/Index', [
            'banks' => Bank::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|unique:banks,account_number',
            'ifsc_code' => 'required|string|max:20',
            'account_holder_name' => 'required|string|max:255',
            'branch' => 'nullable|string|max:255',
        ]);

        Bank::create($validated);

        return back()->with('success', 'Bank account added successfully.');
    }

    public function update(Request $request, Bank $bank)
    {
        $validated = $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|unique:banks,account_number,' . $bank->id,
            'ifsc_code' => 'required|string|max:20',
            'account_holder_name' => 'required|string|max:255',
            'branch' => 'nullable|string|max:255',
        ]);

        $bank->update($validated);

        return back()->with('success', 'Bank account updated successfully.');
    }

    public function destroy(Bank $bank)
    {
        $bank->delete();
        return back()->with('success', 'Bank account removed.');
    }
}