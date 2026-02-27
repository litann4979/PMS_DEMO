<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Invoice {{ $sale->invoice_number }}</title>
    <style>
        @page { margin: 20px; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
           font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #333;
            line-height: 1.4;
            background: #fff;
            padding: 20px;
        }

        .border-wrapper {
            border: 2px solid #2ecc71; /* Main green border from image */
            padding: 20px;
            min-height: 95vh;
        }

        /* Header Section */
        .header-table {
            width: 100%;
            margin-bottom: 20px;
        }

        .company-logo {
            width: 60px;
            height: 60px;
            margin-bottom: 5px;
        }

        .company-name {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
        }

        .invoice-title {
            font-size: 28px;
            color: #2ecc71;
            font-weight: bold;
            text-align: right;
        }

        .meta-table {
            float: right;
            width: 200px;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .meta-table td {
            border: 1px solid #333;
            padding: 4px 8px;
            text-align: center;
        }

        /* Bill To Section */
        .bill-to-header {
            background: #2ecc71;
            color: white;
            padding: 5px 15px;
            font-weight: bold;
            width: 250px;
            margin-bottom: 5px;
        }

        .bill-to-details {
            padding-left: 15px;
            margin-bottom: 20px;
            color: #555;
        }

        /* Items Table */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .items-table th {
            background: #2ecc71;
            color: white;
            padding: 8px;
            text-align: left;
            border: 1px solid #27ae60;
        }

        .items-table td {
            padding: 8px;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            border-bottom: 1px solid #eee;
            font-family: 'DejaVu Sans', sans-serif;
        }

        .items-table tr:last-child td {
            border-bottom: 1px solid #ccc;
        }

        /* Totals Section */
        .totals-container {
            float: right;
            width: 250px;
        }

        .totals-table {
            width: 100%;
            border-collapse: collapse;
        }

        .totals-table td {
            padding: 5px 8px;
            border: 1px solid #ccc;
        }

        .total-row {
            background: #e8f5e9;
            font-weight: bold;
        }

        /* Footer */
        .footer {
            clear: both;
            margin-top: 50px;
            text-align: center;
        }

        .terms-box {
            border: 1px solid #2ecc71;
            width: 300px;
            padding: 10px;
            margin-top: 20px;
        }

        .terms-header {
            background: #2ecc71;
            color: white;
            padding: 2px 10px;
            margin: -10px -10px 10px -10px;
            font-weight: bold;
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }
    </style>
</head>
<body>

<div class="border-wrapper">
    <table class="header-table">
        <tr>
            <td width="50%">
                <div class="company-name">Petro Management System</div>
                <div style="color: #666;">
                    [Street Address]<br>
                    Bhubaneswar, Odisha<br>
                    Phone: +91 98765 43210<br>
                    GST: 27AAAPL1234C1Z5
                </div>
            </td>
            <td width="50%" valign="top">
                <div class="invoice-title">INVOICE</div>
                <table class="meta-table">
                    <tr>
                        <td style="background: #f9f9f9;">DATE</td>
                        <td>{{ \Carbon\Carbon::parse($sale->sale_date)->format('d-m-Y') }}</td>
                    </tr>
                    <tr>
                        <td style="background: #f9f9f9;">INVOICE #</td>
                        <td>{{ $sale->invoice_number }}</td>
                    </tr>
                    <tr>
                        <td style="background: #f9f9f9;">DUE DATE</td>
                        <td>{{ \Carbon\Carbon::parse($sale->sale_date)->addDays(7)->format('d-m-Y') }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <div class="bill-to-header">BILL TO</div>
    <div class="bill-to-details">
        <strong>{{ $sale->customer->name ?? 'Walk-in Customer' }}</strong><br>
        {{ $sale->customer->address ?? 'N/A' }}<br>
        {{ $sale->customer->mobile ?? '' }}<br>
        Vehicle: {{ $sale->vehicle->vehicle_number ?? 'N/A' }}
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th width="40">No.</th>
                <th>PRODUCT DESCRIPTION</th>
                <th width="60" class="text-center">QTY</th>
                <th width="100" class="text-right">PRICE</th>
                <th width="100" class="text-right">AMOUNT</th>
            </tr>
        </thead>
        <tbody>
            @foreach($sale->items as $index => $item)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $item->product->name ?? 'Fuel' }}</td>
                <td class="text-center">&#8377;{{ number_format($item->quantity, 2) }}</td>
                <td class="text-right">&#8377;{{ number_format($item->sale_price, 2) }}</td>
                <td class="text-right">&#8377;{{ number_format($item->subtotal, 2) }}</td>
            </tr>
            @endforeach
            {{-- Empty rows to maintain structure if items are few --}}
            @for ($i = count($sale->items); $i < 10; $i++)
            <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
            </tr>
            @endfor
        </tbody>
    </table>

    <div class="totals-container">
        <table class="totals-table">
            <tr>
                <td>Subtotal</td>
                <td class="text-right">₹{{ number_format($sale->total_amount, 2) }}</td>
            </tr>
            <tr>
                <td>Discount</td>
                <td class="text-right">₹0.00</td>
            </tr>
            <tr class="total-row">
                <td>TOTAL</td>
                <td class="text-right">₹{{ number_format($sale->total_amount, 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="terms-box">
        <div class="terms-header">Terms & Conditions</div>
        1. Total payment due in 7 days.<br>
        2. Please include invoice number on payment.
    </div>

    <div class="footer">
        <p style="font-weight: bold; font-size: 14px; color: #2ecc71;">Thank You For Your Business!</p>
    </div>
</div>

</body>
</html>