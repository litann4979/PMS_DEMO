<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('day_closings', function (Blueprint $table) {

            // Remove unique constraint (use exact index name)
            $table->dropUnique('day_closings_closing_date_unique');

            // Add shift_type column
            $table->enum('shift_type', ['DAY', 'NIGHT'])
                  ->after('closing_date')
                  ->default('DAY');
        });
    }

    public function down(): void
    {
        Schema::table('day_closings', function (Blueprint $table) {

            $table->dropColumn('shift_type');

            // (Optional) Add unique back if needed
            $table->unique('closing_date');
        });
    }
};