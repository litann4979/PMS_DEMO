<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
{
    return Inertia::render('admin/customers/index', [
        // Add withCount('vehicles') here
        'customers' => Customer::with('vehicles')
            ->withCount('vehicles') 
            ->latest()
            ->get()
    ]);
}

    public function create()
    {
        return Inertia::render('admin/customers/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'mobile' => 'required|string',
            'email' => 'nullable|email',
            'gst_number' => 'nullable|string',
        ]);

        Customer::create($validated);
        return redirect()->route('admin.customers.index')->with('success', 'Customer created.');
    }

  // Show individual customer with their related vehicles
public function show(Customer $customer)
{
    return Inertia::render('admin/customers/show', [
        'customer' => $customer->load('vehicles'),
        'stats' => [
            'total_sales' => $customer->sales()->sum('total_amount'),
            'last_visit' => $customer->sales()->latest()->first()?->sale_date,
        ]
    ]);
}

// Show the edit form
public function edit(Customer $customer)
{
    return Inertia::render('admin/customers/edit', [
        'customer' => $customer
    ]);
}

// Handle the update request
public function update(Request $request, Customer $customer)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'company_name' => 'nullable|string|max:255',
        'mobile' => 'required|string',
        'email' => 'nullable|email',
        'address' => 'nullable|string',
        'gst_number' => 'nullable|string',
    ]);

    $customer->update($validated);

    return redirect()->route('admin.customers.index')
        ->with('success', 'Customer updated successfully');
}
}