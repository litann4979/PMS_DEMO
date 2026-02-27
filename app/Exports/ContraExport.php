<?php

namespace App\Exports;

use App\Models\Contra;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ContraExport implements FromCollection, WithHeadings, ShouldAutoSize
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
        return Contra::with(['fromBank', 'toBank'])
            ->whereBetween('transaction_date', [$this->from, $this->to])
            ->get()
            ->map(function ($contra) {
                return [
                    'From'             => optional($contra->fromBank)->bank_name ?? $contra->from_account_type,
                    'To'               => optional($contra->toBank)->bank_name ?? $contra->to_account_type,
                    'Amount'           => $contra->amount,
                    'Remarks'          => $contra->remarks,
                    'Transaction Date' => $contra->transaction_date,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'From',
            'To',
            'Amount',
            'Remarks',
            'Transaction Date',
        ];
    }
}
