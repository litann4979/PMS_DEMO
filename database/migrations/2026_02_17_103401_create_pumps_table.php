<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pumps', function (Blueprint $table) {
            $table->id();

            $table->foreignId('station_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('pump_number'); // e.g., Pump 1, Pump 2

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pumps');
    }
};

