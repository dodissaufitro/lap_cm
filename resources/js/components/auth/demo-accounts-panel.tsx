import { cn } from '@/lib/utils';
import { type DemoUser } from '@/types';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const roleBadgeClass: Record<DemoUser['role'], string> = {
    admin: 'border-rose-200 bg-rose-50 text-rose-700',
    approver: 'border-sky-200 bg-sky-50 text-sky-700',
    pemohon: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

interface DemoAccountsPanelProps {
    accounts: DemoUser[];
    selectedEmail: string;
    disabled?: boolean;
    onSelect: (account: DemoUser) => void;
}

export function DemoAccountsPanel({ accounts, selectedEmail, disabled, onSelect }: DemoAccountsPanelProps) {
    const [open, setOpen] = useState(false);

    if (accounts.length === 0) {
        return null;
    }

    return (
        <div className="mt-5 border-t border-slate-100 pt-5">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
                className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition',
                    'hover:border-sky-300 hover:bg-sky-50/50',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                    open && 'border-sky-300 bg-sky-50/50',
                )}
                aria-expanded={open}
            >
                <span>Akun demo</span>
                <ChevronDown className={cn('size-4 shrink-0 text-slate-500 transition-transform', open && 'rotate-180')} />
            </button>

            {open && (
                <div className="mt-3 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <p className="text-center text-sm text-slate-500">Pilih peran untuk mengisi form secara otomatis</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {accounts.map((account) => (
                            <button
                                key={account.email}
                                type="button"
                                disabled={disabled}
                                onClick={() => onSelect(account)}
                                className={cn(
                                    'min-h-[5.5rem] rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-sky-300 sm:min-h-[6rem] sm:p-5',
                                    'disabled:cursor-not-allowed disabled:opacity-60',
                                    selectedEmail === account.email && 'border-sky-400 ring-1 ring-sky-400/40',
                                )}
                            >
                                <span
                                    className={cn(
                                        'mb-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase',
                                        roleBadgeClass[account.role],
                                    )}
                                >
                                    {account.label}
                                </span>
                                <span className="block text-sm font-medium text-slate-800">{account.name}</span>
                                <span className="mt-0.5 block truncate text-xs text-slate-500">{account.email}</span>
                            </button>
                        ))}
                    </div>
                    <p className="text-center text-[11px] text-slate-500">
                        Kata sandi semua akun demo: <span className="font-medium text-sky-600">password</span>
                    </p>
                </div>
            )}
        </div>
    );
}
