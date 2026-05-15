/**
 * Public URL for a file stored on the `public` disk (requires `php artisan storage:link`).
 */
export function storageUrl(path: string | null | undefined): string | undefined {
    if (!path) {
        return undefined;
    }

    return `/storage/${path.replace(/^\/+/, '')}`;
}
