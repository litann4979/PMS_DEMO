<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {

            $table->foreignId('nozzle_id')
                  ->nullable()
                  ->after('product_id')
                  ->constrained()
                  ->cascadeOnDelete();

        });
    }

    public function down(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {

            $table->dropForeign(['nozzle_id']);
            $table->dropColumn('nozzle_id');

        });
    }
};