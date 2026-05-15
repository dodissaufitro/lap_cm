/** Period label like reference: "March, 2021" */
export function hubExpensePeriodLabel(date = new Date()): string {
    const month = date.toLocaleDateString('en-US', { month: 'long' });

    return `${month}, ${date.getFullYear()}`;
}

/** Date like reference: "12 March 2021" */
export function hubExpenseRowDate(value: string | null | undefined): string {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function hubExpenseSummaryTotal(total: number): string {
    return total.toLocaleString('id-ID');
}
