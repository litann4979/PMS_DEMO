<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       User::create([
        'role_id' => 1,
    'name' => 'Admin',
    'email' => 'admin@pms.com',
    'password' => bcrypt('123456')
]);
    }
}
