import { Label } from '@/components/ui/label';
import { type SelectOption } from '@/types/crud';
import { cn } from '@/lib/utils';

interface FormSelectProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}

export function FormSelect({ id, label, value, onChange, options, placeholder, error, disabled }: FormSelectProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <select
                id={id}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    disabled && 'cursor-not-allowed opacity-50',
                )}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
