import { usePage } from '@inertiajs/react';

export function FlashAlert() {
    const { flash } = usePage<{ flash?: { success?: string | null; error?: string | null } }>().props;

    if (!flash?.success && !flash?.error) return null;

    return (
        <div className="space-y-2">
            {flash.success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                    {flash.error}
                </div>
            )}
        </div>
    );
}
