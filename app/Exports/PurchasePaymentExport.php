<?php

namespace App\Exports;

use App\Models\Payment;
use App\Models\Purchase;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class PurchasePaymentExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    protected $from;
    protected $to;

    public function __construct($from, $to)
    {
        $this->from = $from;
        $this->to = $to;
    }

    public function collection()
    {
        return Payment::with([
                'companyBank',
                'payable.party',
                'counterparty'
            ])
            ->where('payable_type', Purchase::class)
            ->whereBetween('payment_date', [$this->from, $this->to])
            ->get()
            ->map(function ($payment) {

                $partyBank = $payment->counterparty;

                return [
                    'Payable Type'      => 'PURCHASE',
                    'Party'             => optional($payment->payable)->party->name ?? null,
                    'Payment Mode'      => $payment->payment_type,
                    'Company Bank'      => optional($payment->companyBank)->bank_name,
                    'Party Bank Name'   => $partyBank->bank_name ?? null,
                    'Account Number'    => $partyBank->account_number ?? null,
                    'IFSC Code'         => $partyBank->ifsc_code ?? null,
                    'Transaction Ref ID'=> $payment->transaction_reference_id,
                    'Status'            => $payment->status,
                    'Paid Amount'       => $payment->paid_amount,
                    'Payment Date'      => $payment->payment_date,
                    'Remarks'           => $payment->remarks,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Payable Type',
            'Party',
            'Payment Mode',
            'Company Bank',
            'Party Bank Name',
            'Account Number',
            'IFSC Code',
            'Transaction Ref ID',
            'Status',
            'Paid Amount',
            'Payment Date',
            'Remarks',
        ];
    }
}
