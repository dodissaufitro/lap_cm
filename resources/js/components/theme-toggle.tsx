import { useAppearance } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';

const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

function isDarkMode(appearance: string): boolean {
    if (appearance === 'dark') {
        return true;
    }

    if (appearance === 'light') {
        return false;
    }

    return prefersDark();
}

export function ThemeToggle({ className }: { className?: string }) {
    const { appearance, updateAppearance } = useAppearance();
    const dark = isDarkMode(appearance);

    const handleToggle = () => {
        updateAppearance(dark ? 'light' : 'dark');
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className={cn(
                'size-9 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground',
                className,
            )}
            aria-label={dark ? 'Aktifkan tema cerah' : 'Aktifkan tema gelap'}
        >
            {dark ? <Sun className="size-5" strokeWidth={2} /> : <Moon className="size-5" strokeWidth={2} />}
        </Button>
    );
}
