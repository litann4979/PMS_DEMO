<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {

            // Rename reference columns
            $table->renameColumn('reference_type', 'payable_type');
            $table->renameColumn('reference_id', 'payable_id');

            // Rename amount → paid_amount
            $table->renameColumn('amount', 'paid_amount');

            // Add transaction reference
            $table->string('transaction_reference_id')
                  ->nullable()
                  ->after('payment_type');

            // Add payment status
            $table->enum('status', ['PENDING', 'SUCCESS', 'FAILED', 'REVERSED'])
                  ->default('SUCCESS')
                  ->after('transaction_reference_id');

            // Remove old unused column if needed
            // $table->dropColumn('bank_id'); // Uncomment if safe
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {

            $table->renameColumn('payable_type', 'reference_type');
            $table->renameColumn('payable_id', 'reference_id');
            $table->renameColumn('paid_amount', 'amount');

            $table->dropColumn([
                'transaction_reference_id',
                'status'
            ]);
        });
    }
};
