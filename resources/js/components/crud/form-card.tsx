import { ReactNode } from 'react';

export function FormCard({ children }: { children: ReactNode }) {
    return <div className="hub-surface p-6">{children}</div>;
}
