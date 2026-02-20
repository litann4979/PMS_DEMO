<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DayClosing;
use App\Models\DayClosingBreakdown;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DayClosingController extends Controller
{
  public function store(Request $request)
{
    $request->validate([
        'shift_type' => 'required|in:DAY,NIGHT',
        'breakdown' => 'required|array',
        'breakdown.*.denomination' => 'required|numeric',
        'breakdown.*.count' => 'required|integer|min:0',
    ]);

    // Get previous closing as opening
    $openingCash = DayClosing::latest('closed_at')
                    ->value('closing_cash') ?? 0;

    // This is ONLY today's collected amount
    $todayCollection = collect($request->breakdown)->sum(function ($item) {
        return $item['denomination'] * $item['count'];
    });

    // 🔥 FINAL closing cash = opening + today collection
    $finalClosingCash = $openingCash + $todayCollection;

    
     $alreadyClosed = DayClosing::where('closing_date', now()->toDateString())
    ->where('shift_type', $request->shift_type)
    ->exists();

if ($alreadyClosed) {
    return back()->withErrors([
        'shift_type' => 'This shift is already closed for today.'
    ]);
}

    DB::transaction(function () use ($request, $openingCash, $todayCollection, $finalClosingCash) {

        $closing = DayClosing::create([
            'closing_date' => now()->toDateString(),
            'shift_type'   => $request->shift_type,
            'opening_cash' => $openingCash,
            'closing_cash' => $finalClosingCash,
            'closed_at' => now(),
        ]);

        foreach ($request->breakdown as $item) {
            if ($item['count'] > 0) {
                $closing->breakdowns()->create([
                    'denomination' => $item['denomination'],
                    'count' => $item['count'],
                    'total' => $item['denomination'] * $item['count'],
                ]);
            }
        }
    });

    return back()->with('success', 'Day closed successfully.');
}
}
