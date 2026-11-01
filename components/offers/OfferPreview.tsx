'use client'

import { Star, Clock, ExternalLink, MapPin, Info } from 'lucide-react'
import { OfferWithDetails } from '@/lib/types/database'
import { formatPrice, formatDeliveryTime, getTrackingUrl, isDemoSource } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'
import MealImage from './MealImage'

interface OfferPreviewProps {
    offer: OfferWithDetails | null
}

export default function OfferPreview({ offer }: OfferPreviewProps) {
    const { t } = useLanguage()

    if (!offer) {
        return (
            <div className="hidden lg:flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-[#f1ebd8] rounded-[2.5rem] p-8 text-center bg-[#fffcf8]/50">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-[#f1ebd8]/50">
                    <Info className="w-8 h-8 text-[#a08a7e]/50" />
                </div>
                <h3 className="font-bold text-[#3d1d11] mb-2">{t.preview.title}</h3>
                <p className="text-sm text-[#a08a7e]">
                    {t.preview.subtitle}
                </p>
            </div>
        )
    }

    const isDemo = isDemoSource(offer.source)

    const discountPercentage = offer.old_price_cents
        ? Math.round((1 - offer.price_cents / offer.old_price_cents) * 100)
        : 0

    return (
        <div key={offer?.id || 'empty'} className="hidden lg:block animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-[#f1ebd8]/50 flex flex-col">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <MealImage
                        meal={offer.meal}
                        sizes="360px"
                        className="transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="bg-[#3d1d11] text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">
                            {isDemo ? t.card.example : offer.source.name}
                        </span>
                        {discountPercentage > 0 && (
                            <span className="bg-[#e74c3c] text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">
                                -{discountPercentage}% SÄÄSTÖ
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <h3 className="text-2xl font-black text-[#3d1d11] leading-tight mb-2 tracking-tight">
                            {offer.meal.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-[#a08a7e] font-medium">
                            <MapPin className="w-4 h-4 text-[#d35400]" />
                            <span>{offer.meal.restaurant.name}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-[#fff9f0] p-4 rounded-2xl border border-[#f1ebd8]/50">
                            <div className="flex items-center gap-2 text-[#d35400] mb-1">
                                <Star className="w-5 h-5 fill-[#f39c12] text-[#f39c12]" />
                                <span className="text-lg font-black">
                                    {offer.meal.restaurant.rating ? offer.meal.restaurant.rating.toFixed(1) : 'N/A'}
                                </span>
                            </div>
                            <p className="text-[10px] text-[#a08a7e] uppercase font-black tracking-widest">{t.preview.rating}</p>
                        </div>
                        <div className="bg-[#fff9f0] p-4 rounded-2xl border border-[#f1ebd8]/50">
                            <div className="flex items-center gap-2 text-[#3d1d11] mb-1">
                                <Clock className="w-5 h-5 text-[#d35400]" />
                                <span className="text-lg font-black">{formatDeliveryTime(offer.eta_minutes)}</span>
                            </div>
                            <p className="text-[10px] text-[#a08a7e] uppercase font-black tracking-widest">{t.preview.delivery}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-dashed border-[#f1ebd8]">
                        <div>
                            <p className="text-[10px] text-[#a08a7e] uppercase font-black tracking-widest mb-1">{t.preview.price_with_delivery}</p>
                            <span className="text-3xl font-black text-[#e67e22]">
                                {formatPrice(offer.price_cents + offer.delivery_fee_cents)}
                            </span>
                        </div>
                        {discountPercentage > 0 && (
                            <div className="text-right">
                                <p className="text-[10px] text-[#a08a7e] uppercase font-black tracking-widest mb-1">{t.preview.savings}</p>
                                <span className="text-lg font-black text-[#27ae60]">-{discountPercentage}%</span>
                            </div>
                        )}
                    </div>

                    <a
                        href={isDemo ? `/offer/${offer.id}` : getTrackingUrl(offer.id)}
                        {...(isDemo ? {} : { target: '_blank', rel: 'noopener' })}
                        className="w-full bg-[#3d1d11] text-white py-4 rounded-[1.5rem] hover:bg-[#d35400] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        <span className="font-black uppercase text-xs tracking-[0.2em]">{t.card.order}</span>
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    )
}
