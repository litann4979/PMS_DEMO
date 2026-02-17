<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/vehicles/index', [
            'vehicles' => Vehicle::with('customer')->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/vehicles/create', [
            'customers' => Customer::select('id', 'name', 'company_name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'vehicle_number' => 'required|string|unique:vehicles,vehicle_number',
            'vehicle_type' => 'required|string',
            'is_active' => 'boolean',
        ]);

        Vehicle::create($validated);
        return redirect()->route('admin.vehicles.index')->with('success', 'Vehicle registered successfully.');
    }

    public function edit(Vehicle $vehicle)
    {
        return Inertia::render('admin/vehicles/edit', [
            'vehicle' => $vehicle,
            'customers' => Customer::select('id', 'name', 'company_name')->get()
        ]);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'vehicle_number' => 'required|string|unique:vehicles,vehicle_number,' . $vehicle->id,
            'vehicle_type' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $vehicle->update($validated);
        return redirect()->route('admin.vehicles.index')->with('success', 'Vehicle updated.');
    }
}