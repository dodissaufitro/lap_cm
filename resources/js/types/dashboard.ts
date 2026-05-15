export interface DashboardStat {
    title: string;
    value: number;
    icon: 'building' | 'calendar' | 'check' | 'x' | 'clock' | 'file';
}

export interface DashboardPengajuan {
    id: number;
    nomor: string;
    sarana: string;
    pemohon: string;
    tanggal: string;
    status: string;
    status_label: string;
}

export interface DashboardSaranaStatus {
    status: string;
    label: string;
    count: number;
}

export interface DashboardActivity {
    id: number;
    aktivitas: string;
    user: string | null;
    waktu: string;
}

export interface DashboardSchedule {
    id: number;
    sarana: string;
    pemohon: string;
    mulai: string;
    selesai: string;
    status: string;
}

export interface MenuCountEntry {
    total: number;
    label: string;
}

export type MenuCounts = Record<string, MenuCountEntry>;

export interface DashboardPageProps {
    menuCounts: MenuCounts;
    stats: DashboardStat[];
    recentPengajuans: DashboardPengajuan[];
    saranaByStatus: DashboardSaranaStatus[];
    recentActivities: DashboardActivity[];
    upcomingSchedules: DashboardSchedule[];
    pendingApprovals: number;
}
