<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
     Schema::create('vehicles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('customer_id')
          ->nullable()
          ->constrained()
          ->nullOnDelete();
    $table->string('vehicle_number')->nullable();
    $table->string('vehicle_type')->nullable();
    $table->boolean('is_active')->nullable();
    $table->timestamps();
});


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
