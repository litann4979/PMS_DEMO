<?php

namespace App\Exports;

use App\Models\Sale;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class SaleExport implements FromCollection, WithHeadings, ShouldAutoSize
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
        return Sale::with(['customer', 'vehicle'])
            ->whereBetween('sale_date', [$this->from, $this->to])
            ->get()
            ->map(function ($sale) {
                return [
                    'Customer'       => optional($sale->customer)->name ?? 'Walk-in',
                    'Vehicle'        => optional($sale->vehicle)->vehicle_number,
                    'Invoice Number' => $sale->invoice_number,
                    'Total Amount'   => $sale->total_amount,
                    'Paid Amount'    => $sale->paid_amount,
                    'Balance Amount' => $sale->balance_amount,
                    'Status'         => $sale->status,
                    'Sale Date'      => $sale->sale_date,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Customer',
            'Vehicle',
            'Invoice Number',
            'Total Amount',
            'Paid Amount',
            'Balance Amount',
            'Status',
            'Sale Date',
        ];
    }
}
