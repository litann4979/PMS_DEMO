<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {

            // Drop old wrong column if exists
            if (Schema::hasColumn('payments', 'counterparty_bank_id')) {
                $table->dropColumn('counterparty_bank_id');
            }

            // Add correct polymorphic columns
            $table->unsignedBigInteger('counterparty_id')->nullable()->after('company_bank_id');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['counterparty_id', 'counterparty_type']);
        });
    }
};
