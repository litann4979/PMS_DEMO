<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Nozzle;
use App\Models\SalesPerson;
use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShiftController extends Controller
{
       public function index()
    {
        return Inertia::render('admin/shifts/Index', [
            'shifts' => Shift::with(['salesPerson', 'nozzle.product'])->latest()->get(),
            'salesPersons' => SalesPerson::all(),
            'nozzles' => Nozzle::all(),
        ]);
    }

    public function start(Request $request)
    {
        $nozzle = Nozzle::findOrFail($request->nozzle_id);

        Shift::create([
            'sales_person_id' => $request->sales_person_id,
            'nozzle_id' => $nozzle->id,
            'start_meter' => $nozzle->current_meter_reading,
            'shift_start' => now(),
        ]);

        return back();
    }

  public function end(Request $request)
{
    $request->validate([
        'shift_id' => 'required|exists:shifts,id',
        'end_meter' => 'required|numeric|min:0',
    ]);

    $shift = Shift::findOrFail($request->shift_id);
    $nozzle = $shift->nozzle;

    // Safety check: end_meter must be >= start_meter
    if ($request->end_meter < $shift->start_meter) {
        return back()->withErrors(['end_meter' => 'End meter cannot be less than start meter.']);
    }

    $quantity = $request->end_meter - $shift->start_meter;
    
    // Retrieve latest sale price from Price Histories
    $salePrice = $nozzle->product->priceHistories()->latest()->value('sale_price') ?? 0;
    $amount = $quantity * $salePrice;

    $shift->update([
        'end_meter' => $request->end_meter,
        'total_quantity' => $quantity,
        'total_amount' => $amount,
        'shift_end' => now(),
    ]);

    // Update nozzle registry for next shift
    $nozzle->update([
        'current_meter_reading' => $request->end_meter
    ]);

    return back()->with('success', 'Shift finalized successfully.');
}
}
