<?php

namespace App\Exports;

use App\Models\Payment;
use App\Models\Sale;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class SalesPaymentExport implements FromCollection, WithHeadings, ShouldAutoSize
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
                'payable.customer',
                'counterparty'
            ])
            ->where('payable_type', Sale::class)
            ->whereBetween('payment_date', [$this->from, $this->to])
            ->get()
            ->map(function ($payment) {

                $customerBank = $payment->counterparty;

                return [
                    'Payable Type'   => 'SALE',
                    'Customer'       => optional($payment->payable)->customer->name ?? null,
                    'Payment Mode'   => $payment->payment_type,
                    'Company Bank'   => optional($payment->companyBank)->bank_name,
                    'Customer Bank'  => $customerBank->bank_name ?? null,
                    'Account Number' => $customerBank->account_number ?? null,
                    'IFSC Code'      => $customerBank->ifsc_code ?? null,
                    'Transaction ID' => $payment->transaction_reference_id,
                    'Paid Amount'    => $payment->paid_amount,
                    'Remarks'        => $payment->remarks,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Payable Type',
            'Customer',
            'Payment Mode',
            'Company Bank',
            'Customer Bank',
            'Account Number',
            'IFSC Code',
            'Transaction ID',
            'Paid Amount',
            'Remarks',
        ];
    }
}
