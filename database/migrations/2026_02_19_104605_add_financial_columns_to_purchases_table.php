<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purchases', function (Blueprint $table) {

            $table->decimal('paid_amount', 12, 2)->default(0)->after('total_amount');
            $table->decimal('balance_amount', 12, 2)->default(0)->after('paid_amount');

            $table->enum('status', ['UNPAID', 'PARTIALLY_PAID', 'PAID'])
                  ->default('UNPAID')
                  ->after('balance_amount');
        });
    }

    public function down(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropColumn([
                'paid_amount',
                'balance_amount',
                'status'
            ]);
        });
    }
};
