import { cn } from '@/lib/utils';

export const APP_LOGO_URL = '/storage/logo/logo_tch.png';
export const APP_TITLE = 'Tanah Datar Creatif HUB';

interface AppLogoProps {
    showTitle?: boolean;
    className?: string;
    imageClassName?: string;
}

export default function AppLogo({ showTitle = true, className, imageClassName }: AppLogoProps) {
    return (
        <div className={cn('flex min-w-0 items-center gap-2.5', className)}>
            <img
                src={APP_LOGO_URL}
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
