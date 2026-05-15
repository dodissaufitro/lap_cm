import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

function resolveTheme(appearance: Appearance): 'light' | 'dark' {
    if (appearance === 'light') {
        return 'light';
    }

    if (appearance === 'dark') {
        return 'dark';
    }

    return prefersDark() ? 'dark' : 'light';
}

export default function AppearanceTabs({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();
    const selected = resolveTheme(appearance);

    return (
        <div
            className={cn('inline-flex gap-1 rounded-2xl border border-border/60 bg-muted p-1', className)}
            role="group"
            aria-label="Tema tampilan"
            {...props}
        >
            <button
                type="button"
                onClick={() => updateAppearance('light')}
                aria-label="Tema cerah"
                aria-pressed={selected === 'light'}
                className={cn(
                    'flex size-11 items-center justify-center rounded-xl transition-all',
                    selected === 'light'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                )}
            >
                <Sun className="size-5" strokeWidth={2} />
            </button>
            <button
                type="button"
                onClick={() => updateAppearance('dark')}
                aria-label="Tema gelap"
                aria-pressed={selected === 'dark'}
                className={cn(
                    'flex size-11 items-center justify-center rounded-xl transition-all',
                    selected === 'dark'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                )}
            >
                <Moon className="size-5" strokeWidth={2} />
            </button>
        </div>
    );
}
