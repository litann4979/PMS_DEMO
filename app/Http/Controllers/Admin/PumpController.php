<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pump;
use App\Models\Station;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PumpController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/pumps/Index', [
            'pumps' => Pump::with('station')->latest()->get(),
            'stations' => Station::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'station_id' => 'required|exists:stations,id',
            'pump_number' => 'required|string',
        ]);

        Pump::create($request->all());

        return back()->with('success', 'Pump created successfully.');
    }

    public function update(Request $request, Pump $pump)
    {
        $request->validate([
            'station_id' => 'required|exists:stations,id',
            'pump_number' => 'required|string',
        ]);

        $pump->update($request->all());

        return back()->with('success', 'Pump updated successfully.');
    }

    public function destroy(Pump $pump)
    {
        $pump->delete();
        return back()->with('success', 'Pump deleted successfully.');
    }
}