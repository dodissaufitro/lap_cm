/** Format for `<input type="date" />`. */
export function toDateInput(value: unknown): string {
    if (value == null || value === '') {
        return '';
    }

    if (typeof value === 'string') {
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
            return value.slice(0, 10);
        }
    }

    if (typeof value === 'object' && value !== null && 'date' in value) {
        const date = (value as { date?: string }).date;

        if (typeof date === 'string' && date.length >= 10) {
            return date.slice(0, 10);
        }
    }

    const parsed = new Date(typeof value === 'string' ? value : String(value));

    if (Number.isNaN(parsed.getTime())) {
        return '';
    }

    const pad = (n: number) => String(n).padStart(2, '0');

    return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

/** Format ISO/date string for `<input type="datetime-local" />`. */
export function toDatetimeLocal(value: unknown): string {
    if (value == null || value === '') {
        return '';
    }

    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
        return value.slice(0, 16);
    }

    const date = new Date(typeof value === 'string' ? value : String(value));

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const pad = (n: number) => String(n).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Format for display in Indonesian locale. */
export function formatDatetime(value: string | null | undefined): string {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatDate(value: string | null | undefined): string {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
