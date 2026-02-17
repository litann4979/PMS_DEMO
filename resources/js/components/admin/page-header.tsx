import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    children?: ReactNode;
    className?: string;
}

export default function PageHeader({ title, description, icon, children, className = '' }: PageHeaderProps) {
    return (
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 md:p-6 shadow-sm ${className}`}>
            <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                {icon && (
                    <div className="p-2 md:p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl">
                        {icon}
                    </div>
                )}
                <div>
                    <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-300 bg-clip-text text-transparent">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            <div className="w-full sm:w-auto">
                {children}
            </div>
        </div>
    );
}