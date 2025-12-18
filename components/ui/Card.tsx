import { HTMLAttributes, forwardRef } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    glass?: boolean
    hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', glass = false, hover = false, children, ...props }, ref) => {
        const baseStyles = 'rounded-xl overflow-hidden'
        const glassStyles = glass ? 'glass' : 'bg-card border border-border'
        const hoverStyles = hover ? 'hover-lift cursor-pointer' : ''

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = '', children, ...props }, ref) => (
        <div ref={ref} className={`p-6 ${className}`} {...props}>
            {children}
        </div>
    )
)

CardHeader.displayName = 'CardHeader'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = '', children, ...props }, ref) => (
        <div ref={ref} className={`p-6 pt-0 ${className}`} {...props}>
            {children}
        </div>
    )
)

CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = '', children, ...props }, ref) => (
        <div ref={ref} className={`p-6 pt-0 flex items-center ${className}`} {...props}>
            {children}
        </div>
    )
)

CardFooter.displayName = 'CardFooter'

export default Card
