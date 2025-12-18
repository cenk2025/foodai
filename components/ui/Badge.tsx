import { HTMLAttributes, forwardRef } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent' | 'vegan' | 'vegetarian' | 'halal' | 'gluten-free'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className = '', variant = 'default', children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-smooth'

        const variants = {
            default: 'bg-secondary text-secondary-foreground',
            success: 'bg-accent text-accent-foreground',
            warning: 'bg-food-yellow text-gray-900',
            error: 'bg-food-red text-white',
            info: 'bg-primary text-primary-foreground',
            accent: 'bg-accent text-accent-foreground',
            vegan: 'bg-food-green text-white',
            vegetarian: 'bg-food-green/80 text-white',
            halal: 'bg-food-orange text-white',
            'gluten-free': 'bg-food-yellow text-gray-900',
        }

        return (
            <span
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${className}`}
                {...props}
            >
                {children}
            </span>
        )
    }
)

Badge.displayName = 'Badge'

export default Badge
