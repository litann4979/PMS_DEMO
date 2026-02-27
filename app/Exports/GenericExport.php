<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class GenericExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    protected $data;

    protected array $excludeKeys = [
        'created_at',
        'updated_at',
        'created_by',
    ];

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function headings(): array
    {
        if ($this->data->isEmpty()) {
            return [];
        }

        return collect($this->data->first()->toArray())
            ->keys()
            ->reject(fn ($key) => in_array($key, $this->excludeKeys))
            ->map(fn ($key) => ucwords(str_replace('_', ' ', $key)))
            ->values()
            ->toArray();
    }

    public function collection()
    {
        return $this->data->map(function ($item) {
            return collect($item->toArray())
                ->reject(fn ($value, $key) => in_array($key, $this->excludeKeys))
                ->map(function ($value) {
                    if (is_array($value) || is_object($value)) {
                        $arr = (array) $value;
                        return $arr['name'] ?? $arr['bank_name'] ?? $arr['vehicle_number'] ?? json_encode($value);
                    }
                    return $value;
                })
                ->values();
        });
    }
}