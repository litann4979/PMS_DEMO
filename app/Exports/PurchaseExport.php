<?php

namespace App\Exports;

use App\Models\Purchase;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class PurchaseExport implements FromCollection, WithHeadings, ShouldAutoSize
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
        return Purchase::with('party')
            ->whereBetween('purchase_date', [$this->from, $this->to])
            ->get()
            ->map(function ($purchase) {
                return [
                    'Supplier'       => optional($purchase->party)->name,
                    'Bill Number'    => $purchase->bill_number,
                    'Total Amount'   => $purchase->total_amount,
                    'Paid Amount'    => $purchase->paid_amount,
                    'Balance Amount' => $purchase->balance_amount,
                    'Status'         => $purchase->status,
                    'Purchase Date'  => $purchase->purchase_date,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Supplier',
            'Bill Number',
            'Total Amount',
            'Paid Amount',
            'Balance Amount',
            'Status',
            'Purchase Date',
        ];
    }
}
