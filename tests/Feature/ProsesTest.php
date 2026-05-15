<?php

namespace Tests\Feature;

use App\Models\JadwalPenggunaan;
use App\Models\Pengajuan;
use App\Models\User;
use App\Support\PengajuanProsesService;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProsesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_pemohon_can_access_proses_hub_and_sub_pages(): void
    {
        $pemohon = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $this->actingAs($pemohon)
            ->get(route('proses.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('proses/index'));

        $this->actingAs($pemohon)
            ->get(route('proses.check-in.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('proses/check-in/index'));

        $this->actingAs($pemohon)
            ->get(route('proses.check-out.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('proses/check-out/index'));
    }

    public function test_approver_cannot_access_proses_without_permission(): void
    {
        $approver = User::query()->where('email', 'approver@lapcm.test')->first();

        $this->actingAs($approver)
            ->get(route('proses.index'))
            ->assertForbidden();
    }

    public function test_pemohon_can_check_in_own_approved_pengajuan(): void
    {
        $pemohon = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $pengajuan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('user_id', $pemohon->id)
            ->where('status', 'disetujui')
            ->whereNull('checked_in_at')
            ->first();

        $this->assertNotNull($pengajuan);

        $pengajuan->update([
            'tanggal_mulai' => now()->startOfDay()->addHours(8),
            'tanggal_selesai' => now()->startOfDay()->addHours(17),
        ]);

        Storage::fake('public');

        $this->actingAs($pemohon)
            ->post(route('proses.check-in.store', $pengajuan))
            ->assertRedirect(route('proses.check-in.index'));

        $pengajuan->refresh();

        $this->assertNotNull($pengajuan->checked_in_at);
        $this->assertNull($pengajuan->checked_out_at);
        $this->assertNotNull($pengajuan->check_in_barcode_token);
        $this->assertNotNull($pengajuan->check_in_dokumen_path);
        Storage::disk('public')->assertExists($pengajuan->check_in_dokumen_path);

        $this->actingAs($pemohon)
            ->get(route('proses.check-in.document', $pengajuan))
            ->assertOk()
            ->assertHeader('content-type', 'application/pdf');
    }

    public function test_checked_in_pengajuan_stays_on_check_in_list_with_print_ticket(): void
    {
        Storage::fake('public');

        $pemohon = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $pengajuan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('user_id', $pemohon->id)
            ->where('status', 'disetujui')
            ->whereNull('checked_in_at')
            ->first();

        $this->assertNotNull($pengajuan);

        $pengajuan->update([
            'tanggal_mulai' => now()->startOfDay()->addHours(8),
            'tanggal_selesai' => now()->startOfDay()->addHours(17),
        ]);

        $this->actingAs($pemohon)->post(route('proses.check-in.store', $pengajuan));

        $this->actingAs($pemohon)
            ->get(route('proses.check-in.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('items.data', fn ($rows) => collect($rows)->contains(
                    fn (array $row) => $row['id'] === $pengajuan->id
                        && $row['has_checked_in'] === true
                        && $row['can_print_ticket'] === true
                        && $row['can_check_in'] === false,
                )));

        $this->actingAs($pemohon)
            ->post(route('proses.check-in.store', $pengajuan->fresh()))
            ->assertForbidden();
    }

    public function test_check_in_list_shows_all_disetujui_with_can_check_in_flag(): void
    {
        $pemohon = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('user_id', $pemohon->id)
            ->where('status', 'disetujui')
            ->whereNull('checked_in_at')
            ->update([
                'tanggal_mulai' => now()->startOfDay()->addHours(8),
                'tanggal_selesai' => now()->startOfDay()->addHours(17),
            ]);

        $this->actingAs($pemohon)
            ->get(route('proses.check-in.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('proses/check-in/index')
                ->has('items.data')
                ->where('items.data', fn ($rows) => collect($rows)->isNotEmpty()
                    && collect($rows)->every(
                        fn (array $row) => $row['status'] === 'disetujui'
                            && $row['checked_in_at'] === null
                            && array_key_exists('can_check_in', $row),
                    )));
    }

    public function test_pemohon_can_check_out_after_check_in(): void
    {
        $pemohon = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $pengajuan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('user_id', $pemohon->id)
            ->where('status', 'disetujui')
            ->first();

        $this->assertNotNull($pengajuan);

        $pengajuan->update([
            'tanggal_mulai' => now()->subHours(2),
            'tanggal_selesai' => now()->addHour(),
            'checked_in_at' => now()->subHour(),
            'checked_out_at' => null,
        ]);

        $this->actingAs($pemohon)
            ->post(route('proses.check-out.store', $pengajuan))
            ->assertRedirect(route('proses.check-out.index'));

        $pengajuan->refresh();

        $this->assertNotNull($pengajuan->checked_out_at);
        $this->assertSame('selesai', $pengajuan->status);

        $jadwal = JadwalPenggunaan::query()->where('pengajuan_id', $pengajuan->id)->first();

        if ($jadwal) {
            $this->assertSame('selesai', $jadwal->fresh()->status);
        }
    }

    public function test_pemohon_cannot_check_in_other_users_pengajuan(): void
    {
        $pemohon2 = User::query()->where('email', 'pemohon2@lapcm.test')->first();
        $pemohon1 = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $pengajuan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('user_id', $pemohon1->id)
            ->where('status', 'disetujui')
            ->first();

        $this->assertNotNull($pengajuan);

        $pengajuan->update([
            'tanggal_mulai' => now()->subHour(),
            'tanggal_selesai' => now()->addHours(4),
            'checked_in_at' => null,
        ]);

        $this->actingAs($pemohon2)
            ->post(route('proses.check-in.store', $pengajuan))
            ->assertNotFound();
    }

    public function test_pemohon_cannot_check_in_before_event_day(): void
    {
        $pemohon = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $pengajuan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('user_id', $pemohon->id)
            ->where('status', 'disetujui')
            ->whereNull('checked_in_at')
            ->first();

        $this->assertNotNull($pengajuan);

        $pengajuan->update([
            'tanggal_mulai' => now()->addDay()->startOfDay()->addHours(9),
            'tanggal_selesai' => now()->addDay()->startOfDay()->addHours(17),
        ]);

        $this->actingAs($pemohon)
            ->post(route('proses.check-in.store', $pengajuan))
            ->assertForbidden();

        $this->actingAs($pemohon)
            ->get(route('proses.check-in.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('items.data')
                ->where('items.data', fn ($rows) => collect($rows)->contains(
                    fn (array $row) => $row['id'] === $pengajuan->id
                        && $row['can_check_in'] === false
                        && $row['status_label'] === 'Menunggu hari acara',
                )));
    }

    public function test_check_in_active_only_on_same_calendar_day_as_tanggal_mulai(): void
    {
        config(['app.timezone' => 'Asia/Jakarta']);
        Carbon::setTestNow(Carbon::parse('2026-03-16 10:00:00', 'Asia/Jakarta'));

        $pemohon = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $pengajuan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('user_id', $pemohon->id)
            ->where('status', 'disetujui')
            ->whereNull('checked_in_at')
            ->first();

        $this->assertNotNull($pengajuan);

        $pengajuan->update([
            'tanggal_mulai' => '2026-03-16 08:00:00',
            'tanggal_selesai' => '2026-03-18 17:00:00',
        ]);

        $this->assertTrue(PengajuanProsesService::isOnEventDay($pengajuan->fresh()));

        Storage::fake('public');

        $this->actingAs($pemohon)
            ->post(route('proses.check-in.store', $pengajuan))
            ->assertRedirect(route('proses.check-in.index'));

        Carbon::setTestNow();
    }

    public function test_pemohon_cannot_check_in_after_start_date_even_within_event_range(): void
    {
        $pemohon = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $pengajuan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('user_id', $pemohon->id)
            ->where('status', 'disetujui')
            ->whereNull('checked_in_at')
            ->first();

        $this->assertNotNull($pengajuan);

        $pengajuan->update([
            'tanggal_mulai' => now()->subDay()->startOfDay()->addHours(9),
            'tanggal_selesai' => now()->addDay()->startOfDay()->addHours(17),
        ]);

        $this->assertFalse(PengajuanProsesService::isOnEventDay($pengajuan->fresh()));

        $this->actingAs($pemohon)
            ->post(route('proses.check-in.store', $pengajuan))
            ->assertForbidden();

        $this->actingAs($pemohon)
            ->get(route('proses.check-in.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('items.data', fn ($rows) => collect($rows)->contains(
                    fn (array $row) => $row['id'] === $pengajuan->id
                        && $row['can_check_in'] === false
                        && $row['status_label'] === 'Lewat hari check in',
                )));
    }

    public function test_missed_check_in_is_auto_cancelled_after_event_day(): void
    {
        Carbon::setTestNow('2026-05-20 10:00:00');

        $pemohon = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $pengajuan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('user_id', $pemohon->id)
            ->where('status', 'disetujui')
            ->whereNull('checked_in_at')
            ->first();

        $this->assertNotNull($pengajuan);

        $pengajuan->update([
            'tanggal_mulai' => '2026-05-18 08:00:00',
            'tanggal_selesai' => '2026-05-18 17:00:00',
        ]);

        $this->actingAs($pemohon)->get(route('proses.check-in.index'))->assertOk();

        $pengajuan->refresh();

        $this->assertSame('dibatalkan', $pengajuan->status);
        $this->assertNull($pengajuan->checked_in_at);

        Carbon::setTestNow();
    }

    public function test_cancel_missed_check_in_command(): void
    {
        Carbon::setTestNow('2026-05-20 10:00:00');

        $pengajuan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('status', 'disetujui')
            ->whereNull('checked_in_at')
            ->first();

        $this->assertNotNull($pengajuan);

        $pengajuan->update([
            'tanggal_mulai' => '2026-05-17 08:00:00',
            'tanggal_selesai' => '2026-05-17 18:00:00',
        ]);

        $this->artisan('pengajuan:cancel-missed-check-in')->assertSuccessful();

        $this->assertSame('dibatalkan', $pengajuan->fresh()->status);

        Carbon::setTestNow();
    }
}
