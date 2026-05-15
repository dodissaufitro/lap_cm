import { APP_TAGLINE, APP_TITLE, useAppLogoUrl } from '@/lib/app-brand';
import { Bell, LayoutGrid, Shield, Waves } from 'lucide-react';

const features = [
    {
        icon: LayoutGrid,
        title: 'Smart Dashboard',
        description: 'Dashboard modern dan realtime.',
    },
    {
        icon: Shield,
        title: 'Secure System',
        description: 'Keamanan enterprise modern.',
    },
    {
        icon: Waves,
        title: 'Realtime Data',
        description: 'Monitoring data secara realtime.',
    },
    {
        icon: Bell,
        title: 'Smart Alert',
        description: 'Notifikasi sistem otomatis.',
    },
] as const;

export function AuthBrandPanel() {
    const logoUrl = useAppLogoUrl();
    const shortName = APP_TITLE.split(' ').map((w) => w[0]).join('').slice(0, 3) || 'TCH';

    return (
        <aside className="relative hidden w-full flex-col justify-between overflow-hidden bg-[#0b1220] px-8 py-10 text-white lg:flex lg:max-w-[52%] lg:px-12 lg:py-12 xl:max-w-[55%]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_0%,rgba(56,189,248,0.12),transparent_55%)]" />

            <div className="relative z-10">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#38bdf8] shadow-lg shadow-sky-500/25">
                        {logoUrl ? (
                            <img src={logoUrl} alt="" className="size-full object-cover" />
                        ) : (
                            <span className="text-sm font-bold tracking-tight">{shortName}</span>
                        )}
                    </div>
                    <div>
                        <p className="text-lg font-semibold leading-tight">{APP_TITLE}</p>
                        <p className="text-sm text-slate-400">{APP_TAGLINE}</p>
                    </div>
                </div>

                <span className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-sky-300">
                    Modern Digital Ecosystem
                </span>

                <h1 className="mt-8 max-w-lg text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
                    Simple, Modern &amp; Powerful Platform
                </h1>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400 lg:text-[15px]">
                    Platform digital modern untuk monitoring realtime, integrasi sistem, dan pengelolaan layanan
                    enterprise secara efisien.
                </p>
            </div>

            <div className="relative z-10 mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:gap-5 xl:gap-6">
                {features.map(({ icon: Icon, title, description }) => (
                    <div
                        key={title}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-sky-500/30 hover:bg-white/[0.06] sm:p-6 lg:min-h-[8.5rem]"
                    >
                        <Icon className="size-6 text-sky-400 lg:size-7" strokeWidth={1.75} />
                        <p className="mt-4 text-base font-semibold lg:text-lg">{title}</p>
                        <p className="mt-1.5 text-sm leading-snug text-slate-500 lg:text-[15px]">{description}</p>
                    </div>
                ))}
            </div>
        </aside>
    );
}
