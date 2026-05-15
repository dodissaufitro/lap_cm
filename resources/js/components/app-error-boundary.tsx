import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error('Application render error:', error, info.componentStack);
    }

    render() {
        if (this.state.error) {
            return (
                <div className="flex min-h-dvh items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
                    <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/50 dark:bg-slate-900">
                        <h1 className="text-lg font-semibold text-red-700 dark:text-red-300">Terjadi kesalahan</h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Halaman tidak dapat ditampilkan. Muat ulang halaman ini. Jika baru deploy, jalankan{' '}
                            <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">npm run build</code> di server.
                        </p>
                        <p className="mt-3 break-all font-mono text-xs text-slate-500">{this.state.error.message}</p>
                        <button
                            type="button"
                            className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
                            onClick={() => window.location.reload()}
                        >
                            Muat ulang
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
