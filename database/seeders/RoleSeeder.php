<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::updateOrCreate(
            ['slug' => 'admin'],   // condition
            [
                'name' => 'Admin',
                'slug' => 'admin',
            ]
        );
    }
}
