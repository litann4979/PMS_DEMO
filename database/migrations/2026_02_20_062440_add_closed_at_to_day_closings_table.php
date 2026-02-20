<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('day_closings', function (Blueprint $table) {
            $table->timestamp('closed_at')
                  ->nullable()
                  ->after('closing_cash');
        });
    }

    public function down(): void
    {
        Schema::table('day_closings', function (Blueprint $table) {
            $table->dropColumn('closed_at');
        });
    }
};