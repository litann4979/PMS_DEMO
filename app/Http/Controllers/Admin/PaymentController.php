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
                'total_payable' => Purchase::all()->sum->total_amount - Payment::where('reference_type', 'PURCHASE')->sum('amount'),
                'total_receivable' => Sale::all()->sum->total_amount - Payment::where('reference_type', 'SALE')->sum('amount'),
            ]
        ]);
    }

    public function fetchPartyOutstanding(Party $party)
    {
        $purchases = Purchase::where('party_id', $party->id)
            ->with(['payments'])
            ->get()
            ->map(function ($purchase) {
                $purchase->outstanding = $purchase->total_amount - $purchase->payments->sum('amount');
                return $purchase;
            })
            ->filter(fn($p) => $p->outstanding > 0)
            ->values();

        // Fetch saved bank accounts for this supplier
        $bankAccounts = PartyBankAccount::where('party_id', $party->id)->get();

        return response()->json([
            'invoices' => $purchases,
            'bank_accounts' => $bankAccounts
        ]);
    }

    public function fetchCustomerOutstanding(Customer $customer)
    {
        $sales = Sale::where('customer_id', $customer->id)
            ->with(['payments'])
            ->get()
            ->map(function ($sale) {
                $sale->outstanding = $sale->total_amount - $sale->payments->sum('amount');
                return $sale;
            })
            ->filter(fn($s) => $s->outstanding > 0)
            ->values();

        // Fetch saved bank accounts for this customer
        $bankAccounts = CustomerBankAccount::where('customer_id', $customer->id)->get();

        return response()->json([
            'invoices' => $sales,
            'bank_accounts' => $bankAccounts
        ]);
    }

   public function store(Request $request)
{
    $validated = $request->validate([
        'reference_type' => 'required|in:PURCHASE,SALE',
        'reference_id'   => 'required',
        'amount'         => 'required|numeric|min:1',
        'payment_type'   => 'required|in:CASH,CHEQUE,RTGS,BANK',
        'payment_date'   => 'required|date',
        'company_bank_id' => 'required_if:payment_type,BANK,RTGS|nullable|exists:banks,id',
        'party_id'       => 'required_if:reference_type,PURCHASE|nullable|exists:parties,id',
        'customer_id'    => 'required_if:reference_type,SALE|nullable|exists:customers,id',
        'remarks'        => 'nullable|string',

        // Counterparty bank editable fields
        'counterparty_bank_id' => 'nullable',
        'bank_name'            => 'nullable|string',
        'account_number'       => 'nullable|string',
        'ifsc_code'            => 'nullable|string',
        'account_holder_name'  => 'nullable|string',
    ]);

    return DB::transaction(function () use ($validated, $request) {

        $model = $validated['reference_type'] === 'PURCHASE'
            ? Purchase::findOrFail($validated['reference_id'])
            : Sale::findOrFail($validated['reference_id']);

        $outstanding = $model->total_amount - $model->payments()->sum('amount');

        if ($validated['amount'] > $outstanding) {
            return back()->withErrors([
                'amount' => "Amount exceeds outstanding balance (₹$outstanding)"
            ]);
        }

        $counterpartyId = null;
        $counterpartyType = null;

        // Only handle bank logic if not CASH
        if ($validated['payment_type'] !== 'CASH') {

            // CASE 1: Existing Bank Selected
            if ($request->filled('counterparty_bank_id')) {

                $bankModel = $validated['reference_type'] === 'PURCHASE'
                    ? PartyBankAccount::class
                    : CustomerBankAccount::class;

                $bankModel::where('id', $validated['counterparty_bank_id'])->update([
                    'bank_name'           => $request->bank_name,
                    'account_number'      => $request->account_number,
                    'ifsc_code'           => $request->ifsc_code,
                    'account_holder_name' => $request->account_holder_name,
                ]);

                $counterpartyId = $validated['counterparty_bank_id'];
                $counterpartyType = $bankModel;
            }

            // CASE 2: New Bank Details Entered
            elseif ($request->bank_name || $request->account_number) {

                if ($validated['reference_type'] === 'PURCHASE') {

                    $bank = PartyBankAccount::create([
                        'party_id' => $validated['party_id'],
                        'bank_name' => $request->bank_name,
                        'account_number' => $request->account_number,
                        'ifsc_code' => $request->ifsc_code,
                        'account_holder_name' => $request->account_holder_name,
                    ]);

                } else {

                    $bank = CustomerBankAccount::create([
                        'customer_id' => $validated['customer_id'],
                        'bank_name' => $request->bank_name,
                        'account_number' => $request->account_number,
                        'ifsc_code' => $request->ifsc_code,
                        'account_holder_name' => $request->account_holder_name,
                    ]);
                }

                $counterpartyId = $bank->id;
                $counterpartyType = get_class($bank);
            }
        }

        Payment::create([
            'reference_type' => $validated['reference_type'],
            'reference_id'   => $validated['reference_id'],
            'party_id'       => $validated['party_id'] ?? null,
            'customer_id'    => $validated['customer_id'] ?? null,
            'payment_type'   => $validated['payment_type'],
            'company_bank_id'=> $validated['company_bank_id'] ?? null,
            'counterparty_id'=> $counterpartyId,
            'counterparty_type'=> $counterpartyType,
            'amount'         => $validated['amount'],
            'payment_date'   => $validated['payment_date'],
            'remarks'        => $validated['remarks'] ?? null,
        ]);

        return redirect()
            ->route('admin.payments.index')
            ->with('success', 'Payment processed successfully.');
    });
}

}