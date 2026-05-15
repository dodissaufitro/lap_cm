import { type NavItem } from '@/types';
import {
    Activity,
    Building2,
    CalendarDays,
    CheckSquare,
    ClipboardList,
    FolderTree,
    LayoutGrid,
    Paperclip,
    Users,
} from 'lucide-react';

const iconBlue = 'bg-primary/15 text-primary';
const iconGreen = 'bg-[hsl(152,69%,46%)]/15 text-[hsl(152,69%,46%)]';
const iconYellow = 'bg-[hsl(48,96%,53%)]/15 text-[hsl(48,96%,53%)]';
const iconViolet = 'bg-violet-500/15 text-violet-400';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        description: 'Beranda & ringkasan',
        url: '/dashboard',
        icon: LayoutGrid,
        accent: iconBlue,
        ring: 'hub-ring-neon',
    },
    {
        title: 'Pengajuan',
        description: 'Ajukan peminjaman sarana',
        url: '/pengajuans',
        icon: ClipboardList,
        roles: ['admin', 'approver', 'pemohon'],
        accent: iconBlue,
        ring: 'hub-ring-blue',
    },
    {
        title: 'Persetujuan',
        description: 'Tinjau & setujui pengajuan',
        url: '/approval-pengajuans',
        icon: CheckSquare,
        roles: ['admin', 'approver'],
        accent: iconYellow,
        ring: 'hub-ring-gold',
    },
    {
        title: 'Sarana',
        description: 'Data fasilitas & ruangan',
        url: '/saranas',
        icon: Building2,
        roles: ['admin', 'approver', 'pemohon'],
        accent: iconGreen,
        ring: 'hub-ring-mint',
    },
    {
        title: 'Kategori',
        description: 'Kelompok jenis sarana',
        url: '/kategori-saranas',
        icon: FolderTree,
        roles: ['admin'],
        accent: iconViolet,
        ring: 'hub-ring-violet',
    },
    {
        title: 'Jadwal',
        description: 'Jadwal pemakaian sarana',
        url: '/jadwal-penggunaans',
        icon: CalendarDays,
        roles: ['admin', 'approver'],
        accent: iconBlue,
        ring: 'hub-ring-cyan',
    },
    {
        title: 'Lampiran',
        description: 'Berkas & dokumen pendukung',
        url: '/lampirans',
        icon: Paperclip,
        roles: ['admin', 'pemohon'],
        accent: iconYellow,
        ring: 'hub-ring-sunset',
    },
    {
        title: 'Pengguna',
        description: 'Kelola akun pengguna',
        url: '/users',
        icon: Users,
        roles: ['admin'],
        accent: iconViolet,
        ring: 'hub-ring-violet',
    },
    {
        title: 'Log Aktivitas',
        description: 'Riwayat aktivitas sistem',
        url: '/log-aktivitas',
        icon: Activity,
        roles: ['admin'],
        accent: iconGreen,
        ring: 'hub-ring-mint',
    },
];
