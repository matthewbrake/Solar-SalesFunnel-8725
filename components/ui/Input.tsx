
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, id, error, ...props }, ref) => {
        return (
            <div className="w-full">
                <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1">
                    {label}
                </label>
                <input
                    id={id}
                    ref={ref}
                    className={`block w-full px-4 py-3 border rounded-lg shadow-subtle transition duration-150 ease-in-out bg-background-surface
                        ${error
                            ? 'border-danger text-danger placeholder-danger/50 focus:ring-2 focus:ring-danger/30 focus:border-danger'
                            : 'border-border text-text-primary placeholder-text-subtle focus:ring-2 focus:ring-primary/30 focus:border-primary'
                        }
                    `}
                    {...props}
                />
                {error && <p className="mt-2 text-sm text-danger">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;