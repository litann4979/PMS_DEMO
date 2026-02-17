import { SelectHTMLAttributes, forwardRef } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    required?: boolean;
    options: Array<{ value: string | number; label: string }>;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
    ({ label, error, icon, required, options, className = '', ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        {label}
                        {required && <span className="text-rose-500">*</span>}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <select
                        ref={ref}
                        className={`
                            w-full 
                            ${icon ? 'pl-10' : 'px-4'} 
                            pr-10 py-3 
                            bg-gray-50 dark:bg-gray-700/50 
                            border ${error ? 'border-rose-300 dark:border-rose-700' : 'border-gray-200 dark:border-gray-600'}
                            rounded-xl 
                            text-sm 
                            focus:outline-none 
                            focus:ring-2 focus:ring-amber-500/20 
                            focus:border-amber-500 dark:focus:border-amber-400 
                            transition-all
                            appearance-none
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${className}
                        `}
                        {...props}
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
                {error && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

FormSelect.displayName = 'FormSelect';
export default FormSelect;