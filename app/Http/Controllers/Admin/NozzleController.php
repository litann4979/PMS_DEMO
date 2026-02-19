<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Nozzle;
use App\Models\Product;
use App\Models\Pump;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NozzleController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/nozzles/Index', [
            'nozzles' => Nozzle::with(['pump.station', 'product'])->latest()->get(),
            'pumps' => Pump::all(),
            'products' => Product::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pump_id' => 'required|exists:pumps,id',
            'product_id' => 'required|exists:products,id',
            'nozzle_number' => 'required|string',
        ]);

        Nozzle::create($validated);

        return back()->with('success', 'Nozzle created successfully.');
    }

    // Process the Update request
    public function update(Request $request, Nozzle $nozzle)
    {
        $validated = $request->validate([
            'pump_id' => 'required|exists:pumps,id',
            'product_id' => 'required|exists:products,id',
            'nozzle_number' => 'required|string',
        ]);

        $nozzle->update($validated);

        return back()->with('success', 'Nozzle updated successfully.');
    }

    // Process the Delete request
    public function destroy(Nozzle $nozzle)
    {
        $nozzle->delete();

        return back()->with('success', 'Nozzle deleted successfully.');
    }
}