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
    Schema::create('purchase_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('purchase_id')
          ->nullable()
          ->constrained()
          ->nullOnDelete();
    $table->foreignId('product_id')
          ->nullable()
          ->constrained()
          ->nullOnDelete();
    $table->decimal('quantity', 12, 2)->nullable();
    $table->decimal('purchase_price', 10, 2)->nullable();
    $table->decimal('subtotal', 12, 2)->nullable();
    $table->timestamps();
});


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_items');
    }
};
