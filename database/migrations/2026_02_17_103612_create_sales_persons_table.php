<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_persons', function (Blueprint $table) {
            $table->id();

            $table->foreignId('station_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name');
            $table->string('mobile')->nullable();
            $table->string('employee_code')->nullable();

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_persons');
    }
};

