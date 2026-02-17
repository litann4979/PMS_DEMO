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
     Schema::create('payments', function (Blueprint $table) {
    $table->id();
    $table->enum('reference_type', ['PURCHASE', 'SALE'])->nullable();
    $table->unsignedBigInteger('reference_id')->nullable();

    $table->foreignId('party_id')
          ->nullable()
          ->constrained()
          ->nullOnDelete();

    $table->foreignId('customer_id')
          ->nullable()
          ->constrained()
          ->nullOnDelete();

    $table->enum('payment_type', ['CASH', 'CHEQUE', 'RTGS', 'BANK', 'OTHER'])->nullable();

    $table->foreignId('bank_id')
          ->nullable()
          ->constrained()
          ->nullOnDelete();

    $table->decimal('amount', 12, 2)->nullable();
    $table->date('payment_date')->nullable();
    $table->text('remarks')->nullable();

    $table->timestamps();
});


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
