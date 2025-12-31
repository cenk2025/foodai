'use server'

import { createClient } from '@/lib/supabase/server'
import { OfferWithDetails } from '@/lib/types/database'

export interface SearchParams {
    query?: string
    cityId?: string
    maxPrice?: number
    dietFlags?: string[]
    minRating?: number
    deliveryOnly?: boolean
    pickupOnly?: boolean
    sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'eta'
}

export async function searchOffers(params: SearchParams): Promise<OfferWithDetails[]> {
    const supabase = await createClient()
    if (!supabase) return []

    let query = supabase
        .from('offers')
        .select(`
      *,
      meal:meals(
        *,
        restaurant:restaurants(
          *,
          city:cities(*)
        )
      ),
      source:sources(*)
    `)
        .eq('active', true)

    // City filter
    if (params.cityId) {
        query = query.eq('city_id', params.cityId)
    }

    // Price filter
    if (params.maxPrice) {
        query = query.lte('price_cents', params.maxPrice)
    }

    // Delivery/Pickup filter
    if (params.deliveryOnly) {
        query = query.eq('is_pickup', false)
    }
    if (params.pickupOnly) {
        query = query.eq('is_pickup', true)
    }

    const { data: offers, error } = await query

    if (error) {
        console.error('Error fetching offers:', error)
        return []
    }

    if (!offers) return []

    // Filter by search query (meal name or restaurant name)
    let filteredOffers = offers as OfferWithDetails[]

    if (params.query) {
        const searchLower = params.query.toLowerCase()
        filteredOffers = filteredOffers.filter(offer =>
            offer.meal.name.toLowerCase().includes(searchLower) ||
            offer.meal.restaurant.name.toLowerCase().includes(searchLower) ||
            offer.meal.description?.toLowerCase().includes(searchLower)
        )
    }

    // Filter by diet flags
    if (params.dietFlags && params.dietFlags.length > 0) {
        filteredOffers = filteredOffers.filter(offer =>
            params.dietFlags!.every(flag => offer.meal.diet_flags.includes(flag))
        )
    }

    // Filter by rating
    if (params.minRating) {
        filteredOffers = filteredOffers.filter(offer =>
            offer.meal.restaurant.rating >= params.minRating!
        )
    }

    // Sort
    switch (params.sortBy) {
        case 'price_desc':
            filteredOffers.sort((a, b) => b.price_cents - a.price_cents)
            break
        case 'rating':
            filteredOffers.sort((a, b) => b.meal.restaurant.rating - a.meal.restaurant.rating)
            break
        case 'eta':
            filteredOffers.sort((a, b) => {
                const aEta = a.eta_minutes || 999
                const bEta = b.eta_minutes || 999
                return aEta - bEta
            })
            break
        case 'price_asc':
        default:
            filteredOffers.sort((a, b) => a.price_cents - b.price_cents)
            break
    }

    return filteredOffers
}

export async function getCities() {
    const supabase = await createClient()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('cities')
        .select('id, name')
        .order('name')

    if (error) {
        console.error('Error fetching cities:', error)
        return []
    }

    return data || []
}

export async function getOfferById(offerId: string): Promise<OfferWithDetails | null> {
    const supabase = await createClient()
    if (!supabase) return null

    const { data, error } = await supabase
        .from('offers')
        .select(`
      *,
      meal:meals(
        *,
        restaurant:restaurants(
          *,
          city:cities(*)
        )
      ),
      source:sources(*)
    `)
        .eq('id', offerId)
        .single()

    if (error) {
        console.error('Error fetching offer:', error)
        return null
    }

    return data as OfferWithDetails
}

export async function getOffersByGroupKey(groupKey: string): Promise<OfferWithDetails[]> {
    const supabase = await createClient()
    if (!supabase) return []

    const { data, error } = await supabase
        .from('offers')
        .select(`
      *,
      meal:meals(
        *,
        restaurant:restaurants(
          *,
          city:cities(*)
        )
      ),
      source:sources(*)
    `)
        .eq('group_key', groupKey)
        .eq('active', true)
        .order('price_cents', { ascending: true })

    if (error) {
        console.error('Error fetching offers by group key:', error)
        return []
    }

    return (data as OfferWithDetails[]) || []
}
