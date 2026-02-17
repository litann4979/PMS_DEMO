import { ReactNode } from 'react';

interface FormLayoutProps {
    children: ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    className?: string;
}

export default function FormLayout({ children, onSubmit, className = '' }: FormLayoutProps) {
    return (
        <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
            {children}
        </form>
    );
}