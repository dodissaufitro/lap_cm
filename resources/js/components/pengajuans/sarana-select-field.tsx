import { FormSelect } from '@/components/crud/form-select';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useSaranaAvailability } from '@/hooks/use-sarana-availability';
import { useState } from 'react';

interface SaranaBase {
    id: number;
    nama_sarana: string;
    kode_sarana: string;
}

interface SaranaSelectFieldProps {
    saranas: SaranaBase[];
    saranaId: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    onSaranaChange: (value: string) => void;
    error?: string;
    exceptPengajuanId?: number;
}

export function SaranaSelectField({
    saranas,
    saranaId,
    tanggalMulai,
    tanggalSelesai,
    onSaranaChange,
    error,
    exceptPengajuanId,
}: SaranaSelectFieldProps) {
    const { saranaOptions, isBooked, loading, datesReady } = useSaranaAvailability(
        saranas,
        tanggalMulai,
        tanggalSelesai,
        exceptPengajuanId,
    );

    const [bookingAlertOpen, setBookingAlertOpen] = useState(false);
    const [blockedSaranaName, setBlockedSaranaName] = useState('');

    const handleSaranaChange = (value: string) => {
        if (datesReady && !loading && isBooked(value)) {
            const sarana = saranas.find((s) => String(s.id) === value);
            setBlockedSaranaName(sarana ? `${sarana.nama_sarana} (${sarana.kode_sarana})` : 'Sarana ini');
            setBookingAlertOpen(true);

            return;
        }

        onSaranaChange(value);
    };

    return (
        <>
            <div className="grid gap-2">
                <FormSelect
                    id="sarana_id"
                    label="Sarana"
                    value={saranaId}
                    onChange={handleSaranaChange}
                    options={saranaOptions}
                    placeholder={loading ? 'Memuat ketersediaan sarana...' : 'Pilih sarana'}
                    error={error}
                    disabled={loading}
                />
                {datesReady && !loading && (
                    <p className="text-xs text-muted-foreground">
                        Semua sarana ditampilkan. Jika sudah dibooking (status diproses atau disetujui), akan muncul
                        peringatan saat dipilih.
                    </p>
                )}
            </div>

            <Dialog open={bookingAlertOpen} onOpenChange={setBookingAlertOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sarana telah di booking</DialogTitle>
                        <DialogDescription>
                            <span className="font-medium text-foreground">{blockedSaranaName}</span> tidak dapat
                            dipilih karena sudah digunakan pada rentang waktu yang Anda pilih (pengajuan berstatus
                            diproses atau disetujui). Silakan pilih sarana lain atau ubah tanggal penggunaan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" onClick={() => setBookingAlertOpen(false)}>
                            Mengerti
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
