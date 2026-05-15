<?php

namespace Tests\Feature;

use App\Models\Pengajuan;
use App\Models\Sarana;
use App\Models\User;
use App\Support\SaranaBookingService;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SaranaBookingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_availability_marks_booked_sarana_for_overlapping_period(): void
    {
        $pemohon1 = User::query()->where('email', 'pemohon1@lapcm.test')->first();
        $sarana = Sarana::query()->where('status', 'tersedia')->first();

        $existing = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('status', 'disetujui')
            ->where('sarana_id', $sarana->id)
            ->first();

        $this->assertNotNull($existing);

        $response = $this->actingAs($pemohon1)
            ->getJson(route('pengajuans.sarana-availability', [
                'tanggal_mulai' => $existing->tanggal_mulai->format('Y-m-d H:i:s'),
                'tanggal_selesai' => $existing->tanggal_selesai->format('Y-m-d H:i:s'),
            ]))
            ->assertOk();

        $response->assertJsonFragment(['id' => $sarana->id, 'is_booked' => true]);
    }

    public function test_pemohon_cannot_store_on_booked_sarana_slot(): void
    {
        $pemohon2 = User::query()->where('email', 'pemohon2@lapcm.test')->first();
        $existing = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('status', 'diproses')
            ->first();

        $this->assertNotNull($existing);

        $this->actingAs($pemohon2)
            ->post(route('pengajuans.store'), [
                'sarana_id' => $existing->sarana_id,
                'tanggal_pengajuan' => now()->toDateString(),
                'tanggal_mulai' => $existing->tanggal_mulai->format('Y-m-d H:i:s'),
                'tanggal_selesai' => $existing->tanggal_selesai->format('Y-m-d H:i:s'),
                'tujuan_penggunaan' => 'Tabrakan jadwal',
                'status' => 'diajukan',
            ])
            ->assertSessionHasErrors('sarana_id');
    }

    public function test_edit_excludes_own_pengajuan_from_booking_check(): void
    {
        $pemohon1 = User::query()->where('email', 'pemohon1@lapcm.test')->first();
        $own = Pengajuan::query()->where('user_id', $pemohon1->id)->where('status', 'disetujui')->first();

        $this->assertNotNull($own);

        $this->actingAs($pemohon1)
            ->getJson(route('pengajuans.sarana-availability', [
                'tanggal_mulai' => $own->tanggal_mulai->format('Y-m-d H:i:s'),
                'tanggal_selesai' => $own->tanggal_selesai->format('Y-m-d H:i:s'),
                'except_pengajuan_id' => $own->id,
            ]))
            ->assertOk()
            ->assertJsonFragment(['id' => $own->sarana_id, 'is_booked' => false]);
    }

    public function test_diajukan_status_does_not_block_sarana(): void
    {
        $pemohon1 = User::query()->where('email', 'pemohon1@lapcm.test')->first();
        $diajukan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('status', 'diajukan')
            ->first();

        if (! $diajukan) {
            $this->markTestSkipped('No diajukan pengajuan in seed data.');
        }

        $service = app(SaranaBookingService::class);
        $booked = $service->isBooked(
            $diajukan->sarana_id,
            $diajukan->tanggal_mulai,
            $diajukan->tanggal_selesai,
        );

        $this->assertFalse($booked);
    }
}
