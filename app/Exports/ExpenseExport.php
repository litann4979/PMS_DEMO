<?php

namespace App\Exports;

use App\Models\Expense;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ExpenseExport implements FromCollection, WithHeadings, ShouldAutoSize
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
        return Expense::with('bank')
            ->whereBetween('expense_date', [$this->from, $this->to])
            ->get()
            ->map(function ($expense) {
                return [
                    'Category'     => $expense->category,
                    'Payment Mode' => $expense->payment_mode,
                    'Amount'       => $expense->amount,
                    'Bank'         => optional($expense->bank)->bank_name,
                    'Remarks'      => $expense->remarks,
                    'Expense Date' => $expense->expense_date,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Category',
            'Payment Mode',
            'Amount',
            'Bank',
            'Remarks',
            'Expense Date',
        ];
    }
}
