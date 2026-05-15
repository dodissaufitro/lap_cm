import { DeleteButton } from '@/components/crud/delete-button';
import { FlashAlert } from '@/components/crud/flash-alert';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import HubModuleLayout from '@/layouts/hub-module-layout';
import { storageUrl } from '@/lib/storage-url';
import { Head, Link } from '@inertiajs/react';
import { Building2, ChevronLeft, Pencil } from 'lucide-react';

interface Sarana {
    id: number;
    nama_sarana: string;
    kode_sarana: string;
    lokasi: string | null;
    kapasitas: number | null;
    fasilitas: string | null;
    status: string;
    keterangan: string | null;
    foto: string | null;
    kategori?: { id: number; nama_kategori: string };
}

interface Props {
    item: Sarana;
    canManage: boolean;
}

const statusLabels: Record<string, string> = {
    tersedia: 'Tersedia',
    maintenance: 'Maintenance',
    tidak_aktif: 'Tidak Aktif',
};

export default function SaranasShow({ item, canManage }: Props) {
    const fotoUrl = storageUrl(item.foto);

    return (
        <HubModuleLayout>
            <Head title={item.nama_sarana} />

            <div className="flex h-full min-h-0 flex-col overflow-hidden">
                <div className="safe-x relative shrink-0 border-b border-slate-200 px-5 py-4 sm:px-6 lg:px-8 dark:border-white/10">
                    <Link
                        href={route('saranas.index')}
                       
                        className="absolute top-4 left-4 flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted sm:left-5 lg:left-8"
                        aria-label="Kembali ke daftar sarana"
                    >
                        <ChevronLeft className="size-5" />
                    </Link>

                    <div className="pl-10 sm:pl-11 lg:pl-0">
                        <h1 className="text-[22px] leading-tight font-bold text-foreground sm:text-2xl lg:text-3xl">{item.nama_sarana}</h1>
                        <p className="mt-0.5 font-mono text-sm text-muted-foreground">{item.kode_sarana}</p>
                    </div>

                    {canManage && (
                        <div className="mt-4 flex flex-wrap gap-2 pl-10 sm:pl-11 lg:pl-0">
                            <Button variant="secondary" size="sm" className="gap-2" asChild>
                                <Link href={route('saranas.edit', item.id)}>
                                    <Pencil className="size-4" />
                                    Edit
                                </Link>
                            </Button>
                            <DeleteButton href={route('saranas.destroy', item.id)} />
                        </div>
                    )}
                </div>

                <div className="safe-x min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-5 py-4 pb-8 sm:px-6 lg:px-8">
                    <FlashAlert />

                    <div className="hub-sarana-photo mb-6">
                        {fotoUrl ? (
                            <img src={fotoUrl} alt={item.nama_sarana} className="max-h-80 w-full object-cover lg:max-h-96" />
                        ) : (
                            <div
                                className="flex min-h-[12rem] flex-col items-center justify-center gap-3 px-6 py-10 text-muted-foreground lg:min-h-[14rem]"
                                role="img"
                                aria-label="Belum ada foto sarana"
                            >
                                <Building2 className="size-12 text-muted-foreground/40" strokeWidth={1.25} />
                                <p className="text-center text-sm">Belum ada foto sarana</p>
                            </div>
                        )}
                    </div>

                    <div className="hub-glass-card rounded-2xl p-5 sm:p-6">
                        <dl className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm text-muted-foreground">Kategori</dt>
                                <dd className="mt-1 font-medium text-foreground">{item.kategori?.nama_kategori ?? '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Status</dt>
                                <dd className="mt-1">
                                    <StatusBadge
                                        status={item.status}
                                        label={statusLabels[item.status] ?? item.status}
                                        variant="sarana"
                                    />
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Lokasi</dt>
                                <dd className="mt-1 text-foreground">{item.lokasi || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Kapasitas</dt>
                                <dd className="mt-1 text-foreground">{item.kapasitas ?? '-'}</dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm text-muted-foreground">Fasilitas</dt>
                                <dd className="mt-1 whitespace-pre-wrap text-foreground">{item.fasilitas || '-'}</dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm text-muted-foreground">Keterangan</dt>
                                <dd className="mt-1 whitespace-pre-wrap text-foreground">{item.keterangan || '-'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </HubModuleLayout>
    );
}
