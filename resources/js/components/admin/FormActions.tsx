import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, Save } from 'lucide-react';

interface FormActionsProps {
    processing?: boolean;
    submitLabel?: string;
    cancelUrl?: string;
    cancelLabel?: string;
    onSubmit?: () => void;
    isValid?: boolean;
    children?: ReactNode;
}

export default function FormActions({ 
    processing = false, 
    submitLabel = 'Save', 
    cancelUrl, 
    cancelLabel = 'Cancel',
    onSubmit,
    isValid = true,
    children 
}: FormActionsProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {cancelUrl && (
                <Link
                    href={cancelUrl}
                    className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-sm font-medium transition-all duration-200 w-full sm:w-auto text-center"
                >
                    {cancelLabel}
                </Link>
            )}
            
            {children}
            
            <button 
                type="submit"
                onClick={onSubmit}
                disabled={processing || !isValid}
                className={`px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto ${
                    isValid && !processing
                        ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02]' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
            >
                {processing ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4" />
                        {submitLabel}
                        <ChevronRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </div>
    );
}