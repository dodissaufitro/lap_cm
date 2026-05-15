import { APP_TITLE, useAppLogoUrl } from '@/lib/app-brand';
import { cn } from '@/lib/utils';

export { APP_LOGO_URL, APP_TITLE } from '@/lib/app-brand';

interface AppLogoProps {
    showTitle?: boolean;
    className?: string;
    imageClassName?: string;
}

export default function AppLogo({ showTitle = true, className, imageClassName }: AppLogoProps) {
    const logoUrl = useAppLogoUrl();

    return (
        <div className={cn('flex min-w-0 items-center gap-2.5', className)}>
            <img
                src={logoUrl}
                alt={APP_TITLE}
                className={cn('h-9 w-auto shrink-0 object-contain sm:h-10', imageClassName)}
            />
            {showTitle && (
                <div className="grid min-w-0 flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-semibold tracking-tight sm:text-[0.9rem]">{APP_TITLE}</span>
                </div>
            )}
        </div>
    );
}
