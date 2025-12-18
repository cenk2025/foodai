import { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', error, ...props }, ref) => {
        const baseStyles = 'w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring'
        const errorStyles = error ? 'border-food-red' : 'border-input'

        return (
            <div className="w-full">
                <input
                    ref={ref}
                    className={`${baseStyles} ${errorStyles} ${className}`}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-food-red">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
