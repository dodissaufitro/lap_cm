<?php

namespace Tests\Feature;

use App\Models\Pengajuan;
use App\Models\Sarana;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CrudAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_admin_can_access_crud_index_pages(): void
    {
        $admin = User::query()->where('email', 'admin@lapcm.test')->first();

        $routes = [
            'kategori-saranas.index',
            'saranas.index',
            'pengajuans.index',
            'approval-pengajuans.index',
            'jadwal-penggunaans.index',
            'lampirans.index',
            'log-aktivitas.index',
            'users.index',
        ];

        foreach ($routes as $route) {
            $this->actingAs($admin)->get(route($route))->assertOk();
        }
    }

    public function test_pemohon_can_access_own_pengajuan_pages(): void
    {
        $pemohon = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $this->actingAs($pemohon)->get(route('pengajuans.index'))->assertOk();
        $this->actingAs($pemohon)->get(route('pengajuans.create'))->assertOk();
        $this->actingAs($pemohon)->get(route('kategori-saranas.index'))->assertForbidden();
    }

    public function test_pemohon_index_only_lists_own_pengajuans(): void
    {
        $pemohon1 = User::query()->where('email', 'pemohon1@lapcm.test')->first();
        $pemohon2 = User::query()->where('email', 'pemohon2@lapcm.test')->first();

        $ownCount = Pengajuan::query()->where('user_id', $pemohon1->id)->count();
        $otherCount = Pengajuan::query()->where('user_id', $pemohon2->id)->count();

        $this->assertGreaterThan(0, $ownCount);
        $this->assertGreaterThan(0, $otherCount);

        $this->actingAs($pemohon1)
            ->get(route('pengajuans.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('pengajuans/index')
                ->where('items.total', $ownCount)
                ->has('items.data', min(10, $ownCount)));

        $otherPengajuan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('user_id', $pemohon2->id)
            ->first();

        $this->assertNotNull($otherPengajuan);
        $this->actingAs($pemohon1)
            ->get(route('pengajuans.show', $otherPengajuan))
            ->assertNotFound();
    }

    public function test_pemohon_store_assigns_logged_in_user_even_when_user_id_spoofed(): void
    {
        $pemohon1 = User::query()->where('email', 'pemohon1@lapcm.test')->first();
        $pemohon2 = User::query()->where('email', 'pemohon2@lapcm.test')->first();
        $sarana = Sarana::query()->where('status', 'tersedia')->first();

        $this->assertNotNull($sarana);

        $this->actingAs($pemohon1)
            ->post(route('pengajuans.store'), [
                'sarana_id' => $sarana->id,
                'user_id' => $pemohon2->id,
                'tanggal_pengajuan' => now()->toDateString(),
                'tanggal_mulai' => now()->addDay()->format('Y-m-d H:i:s'),
                'tanggal_selesai' => now()->addDays(2)->format('Y-m-d H:i:s'),
                'tujuan_penggunaan' => 'Uji akses pemohon',
                'jumlah_peserta' => 10,
                'status' => 'diajukan',
                'catatan_admin' => 'Harus diabaikan',
            ])
            ->assertRedirect(route('pengajuans.index'));

        $created = Pengajuan::query()
            ->where('tujuan_penggunaan', 'Uji akses pemohon')
            ->first();

        $this->assertNotNull($created);
        $this->assertSame($pemohon1->id, $created->user_id);
        $this->assertNull($created->catatan_admin);
        $this->assertSame('diajukan', $created->status);
    }

    public function test_pemohon_store_accepts_draft_status(): void
    {
        $pemohon1 = User::query()->where('email', 'pemohon1@lapcm.test')->first();
        $sarana = Sarana::query()->where('status', 'tersedia')->first();

        $this->assertNotNull($sarana);

        $this->actingAs($pemohon1)
            ->post(route('pengajuans.store'), [
                'sarana_id' => $sarana->id,
                'tanggal_pengajuan' => now()->toDateString(),
                'tanggal_mulai' => now()->addDay()->format('Y-m-d H:i:s'),
                'tanggal_selesai' => now()->addDays(2)->format('Y-m-d H:i:s'),
                'tujuan_penggunaan' => 'Uji status draft',
                'status' => 'draft',
            ])
            ->assertRedirect(route('pengajuans.index'));

        $created = Pengajuan::query()
            ->where('tujuan_penggunaan', 'Uji status draft')
            ->first();

        $this->assertNotNull($created);
        $this->assertSame('draft', $created->status);
    }

    public function test_pemohon_store_rejects_status_outside_draft_and_diajukan(): void
    {
        $pemohon1 = User::query()->where('email', 'pemohon1@lapcm.test')->first();
        $sarana = Sarana::query()->where('status', 'tersedia')->first();

        $this->assertNotNull($sarana);

        $this->actingAs($pemohon1)
            ->post(route('pengajuans.store'), [
                'sarana_id' => $sarana->id,
                'tanggal_pengajuan' => now()->toDateString(),
                'tanggal_mulai' => now()->addDay()->format('Y-m-d H:i:s'),
                'tanggal_selesai' => now()->addDays(2)->format('Y-m-d H:i:s'),
                'tujuan_penggunaan' => 'Uji status ditolak',
                'status' => 'disetujui',
            ])
            ->assertSessionHasErrors('status');
    }
}
