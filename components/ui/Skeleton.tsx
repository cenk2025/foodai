import { HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    width?: string
    height?: string
    rounded?: 'sm' | 'md' | 'lg' | 'full'
}

export default function Skeleton({
    className = '',
    width,
    height = '1rem',
    rounded = 'md',
    ...props
}: SkeletonProps) {
    const roundedStyles = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    }

    return (
        <div
            className={`skeleton ${roundedStyles[rounded]} ${className}`}
            style={{ width, height }}
            {...props}
        />
    )
}

export function SkeletonCard() {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Skeleton height="200px" rounded="sm" />
            <div className="p-4 space-y-3">
                <Skeleton height="1.5rem" width="70%" />
                <Skeleton height="1rem" width="50%" />
                <div className="flex gap-2">
                    <Skeleton height="1.5rem" width="4rem" rounded="full" />
                    <Skeleton height="1.5rem" width="4rem" rounded="full" />
                </div>
                <div className="flex justify-between items-center pt-2">
                    <Skeleton height="2rem" width="5rem" />
                    <Skeleton height="2.5rem" width="8rem" />
                </div>
            </div>
        </div>
    )
}
