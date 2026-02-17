<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {

            // Company bank used for transaction
            $table->foreignId('company_bank_id')
                ->nullable()
                ->after('bank_id')
                ->constrained('banks')
                ->nullOnDelete();

            // Counterparty bank (party or customer)
            $table->unsignedBigInteger('counterparty_bank_id')->nullable()->after('company_bank_id');
            $table->string('counterparty_type')->nullable()->after('counterparty_bank_id');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['company_bank_id']);
            $table->dropColumn([
                'company_bank_id',
                'counterparty_bank_id',
                'counterparty_type'
            ]);
        });
    }
};
