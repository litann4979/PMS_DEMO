import { TextareaHTMLAttributes, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    required?: boolean;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({ label, error, required, className = '', ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        {label}
                        {required && <span className="text-rose-500">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`
                        w-full px-4 py-3 
                        bg-gray-50 dark:bg-gray-700/50 
                        border ${error ? 'border-rose-300 dark:border-rose-700' : 'border-gray-200 dark:border-gray-600'}
                        rounded-xl 
                        text-sm 
                        focus:outline-none 
                        focus:ring-2 focus:ring-amber-500/20 
                        focus:border-amber-500 dark:focus:border-amber-400 
                        transition-all
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${className}
                    `}
                    {...props}
                />
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

FormTextarea.displayName = 'FormTextarea';
export default FormTextarea;