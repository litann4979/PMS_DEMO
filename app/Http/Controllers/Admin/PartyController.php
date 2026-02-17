<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Party;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartyController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/parties/index', [
            'parties' => Party::latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/parties/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'mobile' => 'required|string|max:20',
            'address' => 'nullable|string',
            'gst_number' => 'nullable|string|max:20',
        ]);

        Party::create($validated);
        return redirect()->route('admin.parties.index')->with('success', 'Party created successfully.');
    }

    public function edit(Party $party)
    {
        return Inertia::render('admin/parties/edit', ['party' => $party]);
    }

    public function update(Request $request, Party $party)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'mobile' => 'required|string|max:20',
            'address' => 'nullable|string',
            'gst_number' => 'nullable|string|max:20',
        ]);

        $party->update($validated);
        return redirect()->route('admin.parties.index')->with('success', 'Party updated successfully.');
    }
}