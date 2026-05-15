import { type SelectOption } from '@/types/crud';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface SaranaBase {
    id: number;
    nama_sarana: string;
    kode_sarana: string;
}

interface SaranaAvailability extends SaranaBase {
    is_booked: boolean;
}

interface AvailabilityResponse {
    saranas: SaranaAvailability[];
}

function toDatetimeParam(value: string): string | null {
    if (!value) {
        return null;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed.toISOString().slice(0, 19).replace('T', ' ');
}

export function useSaranaAvailability(
    saranas: SaranaBase[],
    tanggalMulai: string,
    tanggalSelesai: string,
    exceptPengajuanId?: number,
) {
    const [bookedIds, setBookedIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);

    const datesReady = Boolean(tanggalMulai && tanggalSelesai && tanggalMulai < tanggalSelesai);

    const fetchAvailability = useCallback(async () => {
        const mulai = toDatetimeParam(tanggalMulai);
        const selesai = toDatetimeParam(tanggalSelesai);

        if (!mulai || !selesai || mulai >= selesai) {
            setBookedIds(new Set());

            return;
        }

        const params = new URLSearchParams({
            tanggal_mulai: mulai,
            tanggal_selesai: selesai,
        });

        if (exceptPengajuanId) {
            params.set('except_pengajuan_id', String(exceptPengajuanId));
        }

        setLoading(true);

        try {
            const response = await fetch(`${route('pengajuans.sarana-availability')}?${params.toString()}`, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                setBookedIds(new Set());

                return;
            }

            const data = (await response.json()) as AvailabilityResponse;
            const ids = data.saranas.filter((s) => s.is_booked).map((s) => s.id);

            setBookedIds(new Set(ids));
        } finally {
            setLoading(false);
        }
    }, [tanggalMulai, tanggalSelesai, exceptPengajuanId]);

    useEffect(() => {
        if (!datesReady) {
            setBookedIds(new Set());

            return;
        }

        const timer = window.setTimeout(() => {
            void fetchAvailability();
        }, 300);

        return () => window.clearTimeout(timer);
    }, [datesReady, fetchAvailability]);

    const saranaOptions: SelectOption[] = useMemo(() => {
        if (!datesReady) {
            return [];
        }

        return saranas.map((s) => {
            const isBooked = !loading && bookedIds.has(s.id);

            return {
                value: String(s.id),
                label: isBooked
                    ? `${s.nama_sarana} (${s.kode_sarana}) — Sudah di booking`
                    : `${s.nama_sarana} (${s.kode_sarana})`,
            };
        });
    }, [saranas, bookedIds, datesReady, loading]);

    const isBooked = useCallback((id: string | number) => bookedIds.has(Number(id)), [bookedIds]);

    return {
        saranaOptions,
        bookedIds,
        isBooked,
        loading,
        datesReady,
    };
}
