import { ReactNode } from 'react';

interface FormGridProps {
    children: ReactNode;
    cols?: 1 | 2 | 3 | 4;
    className?: string;
}

export default function FormGrid({ children, cols = 2, className = '' }: FormGridProps) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', // Added better support for large screens
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    };

    return (
        <div className={`grid ${gridCols[cols]} gap-5 md:gap-8 ${className}`}>
            {children}
        </div>
    );
}