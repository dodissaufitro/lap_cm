import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { AppErrorBoundary } from './components/app-error-boundary';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Tanah Datar Creatif HUB';

router.on('invalid', (event) => {
    const status = event.detail.response?.status;

    if (status === 419) {
        window.location.reload();

        return;
    }

    console.error('Inertia received an invalid response.', event.detail.response);
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')).catch((error) => {
            console.error(`Failed to load page "${name}". Run npm run build and redeploy public/build.`, error);

            throw error;
        }),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <AppErrorBoundary>
                <App {...props} />
            </AppErrorBoundary>,
        );
    },
    progress: {
        color: '#2b8cff',
    },
});

initializeTheme();
