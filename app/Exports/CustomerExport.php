<?php

namespace App\Exports;

use App\Models\Customer;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class CustomerExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    public function collection()
    {
        return Customer::with(['vehicles', 'sales'])
            ->get()
            ->map(function ($customer) {
                $vehicles = $customer->vehicles->pluck('vehicle_number')->join(', ');

                return [
                    'Name'         => $customer->name,
                    'Email'        => $customer->email,
                    'Mobile'       => $customer->mobile,
                    'Address'      => $customer->address,
                    'GST Number'   => $customer->gst_number,
                    'Vehicles'     => $vehicles ?: null,
                    'Total Sales'  => $customer->sales->count(),
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Name',
            'Email',
            'Mobile',
            'Address',
            'GST Number',
            'Vehicles',
            'Total Sales',
        ];
    }
}
