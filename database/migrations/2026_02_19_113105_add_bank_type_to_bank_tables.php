<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1️⃣ Company Banks
        Schema::table('banks', function (Blueprint $table) {
            $table->enum('bank_type', ['SAVING', 'CURRENT', 'OD'])
                  ->default('CURRENT')
                  ->after('account_holder_name');
        });

        // 2️⃣ Supplier Bank Accounts
        Schema::table('party_bank_accounts', function (Blueprint $table) {
            $table->enum('bank_type', ['SAVING', 'CURRENT', 'OD'])
                  ->default('CURRENT')
                  ->after('account_holder_name');
        });

        // 3️⃣ Customer Bank Accounts
        Schema::table('customer_bank_accounts', function (Blueprint $table) {
            $table->enum('bank_type', ['SAVING', 'CURRENT', 'OD'])
                  ->default('SAVING')
                  ->after('account_holder_name');
        });
    }

    public function down(): void
    {
        Schema::table('banks', function (Blueprint $table) {
            $table->dropColumn('bank_type');
        });

        Schema::table('party_bank_accounts', function (Blueprint $table) {
            $table->dropColumn('bank_type');
        });

        Schema::table('customer_bank_accounts', function (Blueprint $table) {
            $table->dropColumn('bank_type');
        });
    }
};
