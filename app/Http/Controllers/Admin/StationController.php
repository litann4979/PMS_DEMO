<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Station;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
  public function index()
    {
        return Inertia::render('admin/stations/Index', [
            'stations' => Station::withCount('pumps')->latest()->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
      public function create()
    {
        return Inertia::render('admin/stations/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
        public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'location' => 'nullable|string',
        ]);

        Station::create($request->all());

        return redirect()->route('admin.stations.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $station = Station::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string',
            'location' => 'nullable|string',
        ]);

        $station->update($request->all());

        return redirect()->route('admin.stations.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $station = Station::findOrFail($id);
        $station->delete();

        return redirect()->route('admin.stations.index');
    }
}
