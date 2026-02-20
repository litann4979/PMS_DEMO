<?php

use App\Http\Controllers\Admin\BankController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DayClosingController;
use App\Http\Controllers\Admin\NozzleController;
use App\Http\Controllers\Admin\PartyController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\PumpController;
use App\Http\Controllers\Admin\PurchaseController;
use App\Http\Controllers\Admin\SaleController;
use App\Http\Controllers\Admin\SalesPersonController;
use App\Http\Controllers\Admin\ShiftController;
use App\Http\Controllers\Admin\StationController;
use App\Http\Controllers\Admin\VehicleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('parties', PartyController::class);
    Route::resource('vehicles', VehicleController::class);
    Route::resource('products', ProductController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('purchases', PurchaseController::class);
Route::resource('sales', SaleController::class);


Route::get('payments/party/{party}', [PaymentController::class, 'fetchPartyOutstanding'])->name('payments.fetch.party');
Route::get('payments/customer/{customer}', [PaymentController::class, 'fetchCustomerOutstanding'])->name('payments.fetch.customer');
Route::get('payments/vehicle/{vehicle}', [PaymentController::class, 'fetchVehicleOutstanding'])->name('payments.fetch.vehicle');
Route::resource('payments', PaymentController::class)->only(['index', 'store']);

//Own  Bank management
Route::resource('banks', BankController::class);


Route::resource('stations', StationController::class);
Route::resource('pumps', PumpController::class);
    Route::resource('nozzles', NozzleController::class);
    Route::resource('sales-persons', SalesPersonController::class);

Route::get('shifts', [ShiftController::class, 'index'])->name('shifts.index');
Route::post('shifts/start', [ShiftController::class, 'start'])->name('shifts.start');
Route::post('shifts/end', [ShiftController::class, 'end'])->name('shifts.end');

//Shift Closing
Route::post('day-closing', [DayClosingController::class, 'store'])->name('day-closing.store');

});

require __DIR__.'/settings.php';
