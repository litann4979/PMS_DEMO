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
       Schema::create('contras', function (Blueprint $table) {
    $table->id();

    // CASH or BANK
    $table->enum('from_account_type', ['CASH', 'BANK']);
    $table->enum('to_account_type', ['CASH', 'BANK']);

    // Link specific bank if involved
    $table->foreignId('from_bank_id')
          ->nullable()
          ->constrained('banks')
          ->nullOnDelete();

    $table->foreignId('to_bank_id')
          ->nullable()
          ->constrained('banks')
          ->nullOnDelete();

    $table->decimal('amount', 15, 2);

    $table->date('transaction_date');

    $table->text('remarks')->nullable();

    $table->foreignId('created_by')
          ->constrained('users')
          ->cascadeOnDelete();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contras');
    }
};
