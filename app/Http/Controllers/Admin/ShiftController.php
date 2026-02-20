<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DayClosing;
use App\Models\Nozzle;
use App\Models\SalesPerson;
use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShiftController extends Controller
{
   public function index()
{
    $openingCash = DayClosing::latest('closed_at')
                    ->value('closing_cash') ?? 0;

    return Inertia::render('admin/shifts/Index', [
        'shifts' => Shift::with(['salesPerson', 'nozzle.product'])
                        ->latest()
                        ->get(),
        'salesPersons' => SalesPerson::all(),
        'nozzles' => Nozzle::all(),
        'openingCash' => $openingCash, // 👈 ADD THIS
    ]);
}

public function start(Request $request)
{
    $request->validate([
        'sales_person_id' => 'required|exists:sales_persons,id',
        'nozzle_id' => 'required|exists:nozzles,id',
        'start_meter' => 'nullable|numeric|min:0',
    ]);

    $nozzle = Nozzle::findOrFail($request->nozzle_id);

    // 🚨 Prevent multiple active shifts on same nozzle
    $activeShift = Shift::where('nozzle_id', $nozzle->id)
        ->whereNull('shift_end')
        ->exists();

    if ($activeShift) {
        return back()->withErrors([
            'nozzle_id' => 'This nozzle already has an active shift.'
        ]);
    }

    // If start_meter entered → use it
    // Else → fallback to current meter
    $startMeter = $request->filled('start_meter')
        ? $request->start_meter
        : $nozzle->current_meter_reading;

    // Safety check
    if ($startMeter < $nozzle->current_meter_reading) {
        return back()->withErrors([
            'start_meter' => 'Start meter cannot be less than current nozzle reading.'
        ]);
    }

    Shift::create([
        'sales_person_id' => $request->sales_person_id,
        'nozzle_id' => $nozzle->id,
        'start_meter' => $startMeter,
        'shift_start' => now(),
    ]);

    return back()->with('success', 'Shift started successfully.');
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
