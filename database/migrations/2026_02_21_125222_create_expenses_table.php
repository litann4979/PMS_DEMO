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
       Schema::create('expenses', function (Blueprint $table) {
    $table->id();
    $table->date('expense_date')->nullable();
    $table->string('category')->nullable();
    $table->decimal('amount', 15, 2)->nullable();
    $table->enum('payment_mode', ['CASH', 'BANK']);
    $table->foreignId('bank_id')->nullable()->constrained('banks')->nullOnDelete();
    $table->text('remarks')->nullable();
    $table->foreignId('created_by')->constrained('users');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
