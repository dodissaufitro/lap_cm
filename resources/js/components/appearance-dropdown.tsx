import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const CurrentIcon = appearance === 'light' ? Sun : Moon;

    return (
        <div className={className} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                        <CurrentIcon className="h-5 w-5" />
                        <span className="sr-only">Tema tampilan</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateAppearance('light')}>
                        <Sun className="h-5 w-5" />
                        <span className="sr-only">Cerah</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateAppearance('dark')}>
                        <Moon className="h-5 w-5" />
                        <span className="sr-only">Gelap</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
