import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

type FormInputProps = {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    required?: boolean;
    type?: string;
    rows?: number;
} & (InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>);

const FormInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormInputProps>(
    ({ label, error, icon, required, type = 'text', rows = 3, className = '', ...props }, ref) => {
        const isTextarea = type === 'textarea';
        
        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        {label}
                        {required && <span className="text-rose-500">*</span>}
                    </label>
                )}
                <div className="relative">
                    {icon && !isTextarea && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {icon}
                        </div>
                    )}
                    {isTextarea ? (
                        <textarea
                            ref={ref as any}
                            rows={rows}
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
                            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                        />
                    ) : (
                        <input
                            ref={ref as any}
                            type={type}
                            className={`
                                w-full 
                                ${icon ? 'pl-10' : 'px-4'} 
                                pr-4 py-3 
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
                            {...(props as InputHTMLAttributes<HTMLInputElement>)}
                        />
                    )}
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

FormInput.displayName = 'FormInput';
export default FormInput;