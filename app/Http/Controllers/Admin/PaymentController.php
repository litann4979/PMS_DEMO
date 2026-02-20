<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use App\Models\Customer;
use App\Models\Party;
use App\Models\Payment;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Vehicle;
use App\Models\PartyBankAccount;
use App\Models\CustomerBankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/payments/Index', [
            'parties' => Party::orderBy('name')->get(),
            'customers' => Customer::orderBy('name')->get(),
            'banks' => Bank::orderBy('bank_name')->get(),
            'stats' => [
    'total_payable' => Purchase::sum('balance_amount'),
    'total_receivable' => Sale::sum('balance_amount'),
]

        ]);
    }


   public function fetchPartyOutstanding(Party $party)
{
    $purchases = Purchase::where('party_id', $party->id)
        ->where('balance_amount', '>', 0)
        ->get()
        ->map(function ($purchase) {
            $purchase->outstanding = $purchase->balance_amount;
            return $purchase;
        })
        ->values();

    $bankAccounts = PartyBankAccount::where('party_id', $party->id)->get();

    return response()->json([
        'invoices' => $purchases,
        'bank_accounts' => $bankAccounts
    ]);
}


public function fetchCustomerOutstanding(Customer $customer)
{
    $sales = Sale::where('customer_id', $customer->id)
        ->where('balance_amount', '>', 0)
        ->get()
        ->map(function ($sale) {
            $sale->outstanding = $sale->balance_amount;
            return $sale;
        })
        ->values();

    $bankAccounts = CustomerBankAccount::where('customer_id', $customer->id)->get();

    return response()->json([
        'invoices' => $sales,
        'bank_accounts' => $bankAccounts
    ]);
}


public function store(Request $request)
{
    $validated = $request->validate([
        'payable_type'   => 'required|in:SALE,PURCHASE',
        'payable_id'     => 'required',
        'paid_amount'    => 'required|numeric|min:1',
        'payment_type'   => 'required|in:CASH,CHEQUE,RTGS,BANK,UPI',
        'payment_date'   => 'required|date',
        'company_bank_id'=> 'nullable|exists:banks,id',
        'transaction_reference_id' => 'nullable|string|max:255',
        'remarks'        => 'nullable|string',

        // Counterparty fields
        'counterparty_bank_id' => 'nullable',
        'bank_name'            => 'nullable|string',
        'account_number'       => 'nullable|string',
        'ifsc_code'            => 'nullable|string',
        'account_holder_name'  => 'nullable|string',
        'bank_type'            => 'nullable|in:SAVING,CURRENT,OD',
    ]);

    return DB::transaction(function () use ($validated, $request) {

        // Resolve Model
        $modelClass = $validated['payable_type'] === 'SALE'
            ? Sale::class
            : Purchase::class;

        $model = $modelClass::findOrFail($validated['payable_id']);

        if ($validated['paid_amount'] > $model->balance_amount) {
            return back()->withErrors([
                'paid_amount' => "Amount exceeds outstanding balance (₹{$model->balance_amount})"
            ]);
        }

        $counterpartyId = null;
        $counterpartyType = null;

        /*
        |--------------------------------------------------------------------------
        | HANDLE COUNTERPARTY BANK
        |--------------------------------------------------------------------------
        */

        if ($validated['payment_type'] !== 'CASH') {

            // CASE 1: Existing bank selected
            if ($request->filled('counterparty_bank_id')) {

                $bankModel = $validated['payable_type'] === 'PURCHASE'
                    ? PartyBankAccount::class
                    : CustomerBankAccount::class;

                // Update editable fields
                $bankModel::where('id', $validated['counterparty_bank_id'])
                    ->update([
                        'bank_name'           => $request->bank_name,
                        'bank_type'           => $request->bank_type,
                        'account_number'      => $request->account_number,
                        'ifsc_code'           => $request->ifsc_code,
                        'account_holder_name' => $request->account_holder_name,
                    ]);

                $counterpartyId = $validated['counterparty_bank_id'];
                $counterpartyType = $bankModel;
            }

            // CASE 2: New bank entered
            elseif ($request->bank_name || $request->account_number) {

                if ($validated['payable_type'] === 'PURCHASE') {

                    $bank = PartyBankAccount::create([
                        'party_id' => $model->party_id,
                        'bank_name' => $request->bank_name,
                        'bank_type' => $request->bank_type ?? 'CURRENT',
                        'account_number' => $request->account_number,
                        'ifsc_code' => $request->ifsc_code,
                        'account_holder_name' => $request->account_holder_name,
                    ]);

                } else {

                    $bank = CustomerBankAccount::create([
                        'customer_id' => $model->customer_id,
                        'bank_name' => $request->bank_name,
                        'bank_type' => $request->bank_type ?? 'SAVING',
                        'account_number' => $request->account_number,
                        'ifsc_code' => $request->ifsc_code,
                        'account_holder_name' => $request->account_holder_name,
                    ]);
                }

                $counterpartyId = $bank->id;
                $counterpartyType = get_class($bank);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | CREATE PAYMENT
        |--------------------------------------------------------------------------
        */

        Payment::create([
            'payable_type'   => $modelClass,
            'payable_id'     => $validated['payable_id'],
            'paid_amount'    => $validated['paid_amount'],
            'payment_type'   => $validated['payment_type'],
            'transaction_reference_id' => $validated['transaction_reference_id'] ?? null,
            'company_bank_id'=> $validated['company_bank_id'] ?? null,
            'counterparty_id'   => $counterpartyId,
            'counterparty_type' => $counterpartyType,
            'payment_date'   => $validated['payment_date'],
            'status'         => 'SUCCESS',
            'remarks'        => $validated['remarks'] ?? null,
        ]);

        /*
        |--------------------------------------------------------------------------
        | UPDATE SALE / PURCHASE BALANCE
        |--------------------------------------------------------------------------
        */

        $model->increment('paid_amount', $validated['paid_amount']);
        $model->decrement('balance_amount', $validated['paid_amount']);

        $model->update([
            'status' => $model->balance_amount == 0
                ? 'PAID'
                : 'PARTIALLY_PAID'
        ]);

        return redirect()
            ->route('admin.payments.index')
            ->with('success', 'Payment processed successfully.');
    });
}

}