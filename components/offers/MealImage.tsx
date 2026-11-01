import Image from 'next/image'
import { getMealVisual } from '@/lib/utils'

interface MealImageProps {
    meal: { name: string; image_path?: string | null; diet_flags?: string[] | null }
    sizes?: string
    priority?: boolean
    className?: string
    emojiClassName?: string
}

// Fills its positioned parent: the meal's photo, or a dish icon when we have no
// photo that truthfully shows this meal.
export default function MealImage({ meal, sizes, priority, className = '', emojiClassName = 'text-6xl' }: MealImageProps) {
    const { src, emoji } = getMealVisual(meal.name, meal.image_path, meal.diet_flags)

    if (src) {
        return <Image src={src} alt={meal.name} fill priority={priority} sizes={sizes} className={`object-cover ${className}`} />
    }

    return (
        <div
            role="img"
            aria-label={meal.name}
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-soft to-line ${className}`}
        >
            <span aria-hidden="true" className={emojiClassName}>{emoji}</span>
        </div>
    )
}
