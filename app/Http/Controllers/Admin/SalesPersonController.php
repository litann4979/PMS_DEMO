<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SalesPerson;
use App\Models\Station;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesPersonController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/sales-persons/Index', [
            // Added latest() to show new staff at the top
            'salesPersons' => SalesPerson::with('station')->latest()->get(),
            'stations' => Station::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'station_id' => 'required|exists:stations,id',
            'name' => 'required|string|max:255',
            'mobile' => 'required|string|max:20',
        ]);

        SalesPerson::create($validated);

        return back()->with('success', 'Staff member registered.');
    }

    // Process the Update request
    public function update(Request $request, SalesPerson $salesPerson)
    {
        $validated = $request->validate([
            'station_id' => 'required|exists:stations,id',
            'name' => 'required|string|max:255',
            'mobile' => 'required|string|max:20',
        ]);

        $salesPerson->update($validated);

        return back()->with('success', 'Staff details updated.');
    }

    // Process the Delete request
    public function destroy(SalesPerson $salesPerson)
    {
        $salesPerson->delete();

        return back()->with('success', 'Staff member removed.');
    }
}