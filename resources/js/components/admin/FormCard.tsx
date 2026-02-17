import { ReactNode } from 'react';

interface FormCardProps {
    children: ReactNode;
    title?: string;
    icon?: ReactNode;
    className?: string;
}

export default function FormCard({ children, title, icon, className = '' }: FormCardProps) {
    return (
        <div className={`
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700 
            rounded-2xl shadow-sm 
            p-6 
            ${className}
        `}>
            {title && (
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    {icon}
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
}