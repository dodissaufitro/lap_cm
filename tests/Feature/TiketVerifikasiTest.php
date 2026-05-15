<?php

namespace Tests\Feature;

use App\Models\Pengajuan;
use App\Models\User;
use App\Support\PengajuanTicketBarcode;
use App\Support\PengajuanTicketQr;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TiketVerifikasiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_public_verification_page_shows_pemohon_and_sarana(): void
    {
        $pemohon = User::query()->where('email', 'pemohon1@lapcm.test')->first();

        $pengajuan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('user_id', $pemohon->id)
            ->where('status', 'disetujui')
            ->with('sarana.kategori')
            ->first();

        $this->assertNotNull($pengajuan);

        $pengajuan->update([
            'checked_in_at' => now(),
            'check_in_barcode_token' => PengajuanTicketBarcode::generateToken(),
        ]);

        $response = $this->get(route('tiket.verifikasi', $pengajuan->check_in_barcode_token));

        $response
            ->assertOk()
            ->assertSee('Data Pemohon', false)
            ->assertSee('Sarana Dipilih', false)
            ->assertSee($pemohon->name, false)
            ->assertSee($pemohon->email, false)
            ->assertSee($pengajuan->sarana->nama_sarana, false)
            ->assertSee($pengajuan->sarana->kode_sarana, false)
            ->assertDontSee('Tujuan', false);
    }

    public function test_verification_fails_without_check_in(): void
    {
        $pengajuan = Pengajuan::withoutGlobalScope(Pengajuan::SCOPE_FOR_AUTH_USER)
            ->where('status', 'disetujui')
            ->whereNull('checked_in_at')
            ->first();

        $this->assertNotNull($pengajuan);

        $token = PengajuanTicketBarcode::generateToken();
        $pengajuan->update(['check_in_barcode_token' => $token]);

        $this->get(route('tiket.verifikasi', $token))->assertNotFound();
    }

    public function test_check_in_sets_token_and_qr_payload_url(): void
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

        $this->actingAs($pemohon)
            ->post(route('proses.check-in.store', $pengajuan));

        $pengajuan->refresh();

        $this->assertNotNull($pengajuan->check_in_barcode_token);

        $expectedUrl = route('tiket.verifikasi', ['token' => $pengajuan->check_in_barcode_token], absolute: true);

        $this->assertSame($expectedUrl, PengajuanTicketBarcode::qrPayload($pengajuan));
        $this->assertNotEmpty(PengajuanTicketQr::pngBase64($expectedUrl));
    }

    public function test_print_ticket_returns_pdf_with_qr_document(): void
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
            ->get(route('proses.check-in.document', $pengajuan->fresh()))
            ->assertOk()
            ->assertHeader('content-type', 'application/pdf');
    }
}
