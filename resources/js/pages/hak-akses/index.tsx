import { FlashAlert } from '@/components/crud/flash-alert';
import { PageHeader } from '@/components/crud/page-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type UserRole } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LogIn, Save, Shield } from 'lucide-react';
import { FormEventHandler } from 'react';

interface MenuDefinition {
    key: string;
    title: string;
    description: string;
}

interface RoleOption {
    value: UserRole;
    label: string;
}

interface Props {
    menus: MenuDefinition[];
    roles: RoleOption[];
    permissions: Record<UserRole, Record<string, boolean>>;
    loginAccess: Record<UserRole, boolean>;
}

const roleTone: Record<UserRole, string> = {
    admin: 'text-violet-700 dark:text-violet-300',
    approver: 'text-amber-700 dark:text-amber-300',
    pemohon: 'text-sky-700 dark:text-sky-300',
};

export default function HakAksesIndex({ menus, roles, permissions, loginAccess }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Hak Akses', href: route('hak-akses.index') },
    ];

    const { data, setData, put, processing } = useForm({
        permissions,
        loginAccess,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('hak-akses.update'));
    };

    const toggleLogin = (role: UserRole, checked: boolean) => {
        setData('loginAccess', { ...data.loginAccess, [role]: checked });
    };

    const toggleMenu = (role: UserRole, menuKey: string, checked: boolean) => {
        setData('permissions', {
            ...data.permissions,
            [role]: {
                ...data.permissions[role],
                [menuKey]: checked,
            },
        });
    };

    const toggleRoleRow = (role: UserRole, checked: boolean) => {
        const next = { ...data.permissions[role] };
        menus.forEach((menu) => {
            next[menu.key] = checked;
        });
        setData('permissions', { ...data.permissions, [role]: next });
    };

    const toggleMenuColumn = (menuKey: string, checked: boolean) => {
        const next = { ...data.permissions };
        roles.forEach((role) => {
            next[role.value] = { ...next[role.value], [menuKey]: checked };
        });
        setData('permissions', next);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hak Akses" />

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6 2xl:max-w-7xl">
                <PageHeader
                    title="Hak Akses"
                    description="Atur siapa yang boleh login dan menu apa yang dapat diakses setiap peran."
                />

                <FlashAlert />

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <section className="hub-glass-card p-5 sm:p-6">
                        <div className="mb-5 flex items-start gap-3">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                <LogIn className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Akses Login</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Nonaktifkan peran yang tidak boleh masuk ke sistem (selain status akun aktif).
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            {roles.map((role) => (
                                <label
                                    key={role.value}
                                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]"
                                >
                                    <Checkbox
                                        checked={data.loginAccess[role.value]}
                                        onCheckedChange={(checked) => toggleLogin(role.value, checked === true)}
                                    />
                                    <span className={cn('text-sm font-semibold', roleTone[role.value])}>{role.label}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="hub-glass-card overflow-hidden p-0 sm:p-0">
                        <div className="border-b border-slate-200 px-5 py-4 dark:border-white/10 sm:px-6">
                            <div className="flex items-start gap-3">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-600 dark:text-violet-300">
                                    <Shield className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">Akses Menu</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Centang menu yang boleh dibuka oleh masing-masing peran di dashboard.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[40rem] border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-white/10 dark:bg-white/[0.03]">
                                        <th className="px-4 py-3 text-left font-semibold text-foreground sm:px-6">Menu</th>
                                        {roles.map((role) => (
                                            <th key={role.value} className="px-3 py-3 text-center font-semibold">
                                                <button
                                                    type="button"
                                                    className={cn('text-xs font-semibold uppercase tracking-wide', roleTone[role.value])}
                                                    onClick={() => {
                                                        const allOn = menus.every((m) => data.permissions[role.value][m.key]);
                                                        toggleRoleRow(role.value, !allOn);
                                                    }}
                                                >
                                                    {role.label}
                                                </button>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {menus.map((menu) => (
                                        <tr
                                            key={menu.key}
                                            className="border-b border-slate-100 last:border-0 dark:border-white/5"
                                        >
                                            <td className="px-4 py-3.5 sm:px-6">
                                                <p className="font-medium text-foreground">{menu.title}</p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">{menu.description}</p>
                                                <button
                                                    type="button"
                                                    className="mt-1 text-[11px] text-primary hover:underline"
                                                    onClick={() => {
                                                        const allOn = roles.every((r) => data.permissions[r.value][menu.key]);
                                                        toggleMenuColumn(menu.key, !allOn);
                                                    }}
                                                >
                                                    Toggle kolom
                                                </button>
                                            </td>
                                            {roles.map((role) => (
                                                <td key={role.value} className="px-3 py-3.5 text-center">
                                                    <Checkbox
                                                        checked={data.permissions[role.value][menu.key] ?? false}
                                                        onCheckedChange={(checked) =>
                                                            toggleMenu(role.value, menu.key, checked === true)
                                                        }
                                                        aria-label={`${menu.title} — ${role.label}`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <div className="flex flex-wrap gap-2">
                        <Button type="submit" disabled={processing} className="gap-2">
                            <Save className="size-4" />
                            Simpan Pengaturan
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
