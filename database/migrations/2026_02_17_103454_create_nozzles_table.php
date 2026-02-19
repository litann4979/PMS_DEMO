<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nozzles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pump_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('product_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('nozzle_number'); // e.g., N1, N2

            $table->decimal('current_meter_reading', 14, 2)
                ->default(0); // Important for fuel precision

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nozzles');
    }
};

