export default function DashboardSaranaUmum() {
  const stats = [
    {
      title: 'Total Sarana',
      value: 24,
      icon: '🏢',
    },
    {
      title: 'Pengajuan Hari Ini',
      value: 12,
      icon: '📄',
    },
    {
      title: 'Disetujui',
      value: 8,
      icon: '✅',
    },
    {
      title: 'Ditolak',
      value: 2,
      icon: '❌',
    },
  ];

  const pengajuanTerbaru = [
    {
      nama: 'Aula Serbaguna',
      pemohon: 'Dodis Saufitro',
      tanggal: '15 Mei 2026',
      status: 'Disetujui',
    },
    {
      nama: 'Lapangan Basket',
      pemohon: 'Budi Santoso',
      tanggal: '15 Mei 2026',
      status: 'Pending',
    },
    {
      nama: 'Mobil Operasional',
      pemohon: 'Siti Rahma',
      tanggal: '14 Mei 2026',
      status: 'Ditolak',
    },
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case 'Disetujui':
        return 'bg-green-100 text-green-700';
      case 'Ditolak':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Sarana Umum
          </h1>
          <p className="text-gray-500">
            Sistem Pengajuan Penggunaan Sarana dan Prasarana
          </p>
        </div>

        <button className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105">
          + Tambah Pengajuan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <h2 className="mt-2 text-4xl font-bold text-gray-800">
                  {item.value}
                </h2>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Pengajuan Terbaru
            </h2>

            <input
              type="text"
              placeholder="Cari pengajuan..."
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                  <th className="pb-4">Sarana</th>
                  <th className="pb-4">Pemohon</th>
                  <th className="pb-4">Tanggal</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {pengajuanTerbaru.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-50 transition hover:bg-gray-50"
                  >
                    <td className="py-4 font-medium text-gray-700">
                      {item.nama}
                    </td>

                    <td className="py-4 text-gray-600">{item.pemohon}</td>

                    <td className="py-4 text-gray-600">{item.tanggal}</td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold ${statusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-gray-800">
              Status Sarana
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-green-50 p-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Tersedia</h3>
                  <p className="text-sm text-gray-500">18 Sarana</p>
                </div>

                <span className="text-2xl">🟢</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-yellow-50 p-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Maintenance</h3>
                  <p className="text-sm text-gray-500">4 Sarana</p>
                </div>

                <span className="text-2xl">🟡</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-red-50 p-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Tidak Aktif</h3>
                  <p className="text-sm text-gray-500">2 Sarana</p>
                </div>

                <span className="text-2xl">🔴</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-gray-800">
              Aktivitas Hari Ini
            </h2>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-lg">📌</div>
                <div>
                  <p className="font-medium text-gray-700">
                    Pengajuan Aula Serbaguna disetujui
                  </p>
                  <p className="text-sm text-gray-500">5 menit lalu</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 text-lg">📌</div>
                <div>
                  <p className="font-medium text-gray-700">
                    Pengajuan Mobil Operasional ditolak
                  </p>
                  <p className="text-sm text-gray-500">20 menit lalu</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 text-lg">📌</div>
                <div>
                  <p className="font-medium text-gray-700">
                    Sarana baru berhasil ditambahkan
                  </p>
                  <p className="text-sm text-gray-500">1 jam lalu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
