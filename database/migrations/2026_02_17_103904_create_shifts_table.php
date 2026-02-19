<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sales_person_id')
                 ->constrained('sales_persons')
                 ->cascadeOnDelete();


            $table->foreignId('nozzle_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->decimal('start_meter', 14, 2);
            $table->decimal('end_meter', 14, 2)->nullable();

            $table->decimal('total_quantity', 14, 2)->nullable();
            $table->decimal('total_amount', 14, 2)->nullable();

            $table->timestamp('shift_start');
            $table->timestamp('shift_end')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};

