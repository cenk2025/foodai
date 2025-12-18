export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            cities: {
                Row: {
                    id: string
                    name: string
                    country_code: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    country_code?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    country_code?: string
                    created_at?: string
                }
            }
            sources: {
                Row: {
                    id: string
                    name: string
                    type: 'delivery_platform' | 'restaurant_site' | 'affiliate_feed' | 'demo'
                    base_url: string | null
                    logo_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    type: 'delivery_platform' | 'restaurant_site' | 'affiliate_feed' | 'demo'
                    base_url?: string | null
                    logo_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    type?: 'delivery_platform' | 'restaurant_site' | 'affiliate_feed' | 'demo'
                    base_url?: string | null
                    logo_url?: string | null
                    created_at?: string
                }
            }
            restaurants: {
                Row: {
                    id: string
                    city_id: string
                    name: string
                    address: string | null
                    rating: number
                    tags: string[]
                    created_at: string
                }
                Insert: {
                    id?: string
                    city_id: string
                    name: string
                    address?: string | null
                    rating?: number
                    tags?: string[]
                    created_at?: string
                }
                Update: {
                    id?: string
                    city_id?: string
                    name?: string
                    address?: string | null
                    rating?: number
                    tags?: string[]
                    created_at?: string
                }
            }
            meals: {
                Row: {
                    id: string
                    restaurant_id: string
                    name: string
                    description: string | null
                    diet_flags: string[]
                    allergens: string[]
                    image_path: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    restaurant_id: string
                    name: string
                    description?: string | null
                    diet_flags?: string[]
                    allergens?: string[]
                    image_path?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    restaurant_id?: string
                    name?: string
                    description?: string | null
                    diet_flags?: string[]
                    allergens?: string[]
                    image_path?: string | null
                    created_at?: string
                }
            }
            offers: {
                Row: {
                    id: string
                    meal_id: string
                    source_id: string
                    city_id: string
                    price_cents: number
                    currency: string
                    old_price_cents: number | null
                    delivery_fee_cents: number
                    eta_minutes: number | null
                    is_pickup: boolean
                    source_url: string
                    external_offer_id: string | null
                    group_key: string | null
                    active: boolean
                    updated_at: string
                }
                Insert: {
                    id?: string
                    meal_id: string
                    source_id: string
                    city_id: string
                    price_cents: number
                    currency?: string
                    old_price_cents?: number | null
                    delivery_fee_cents?: number
                    eta_minutes?: number | null
                    is_pickup?: boolean
                    source_url: string
                    external_offer_id?: string | null
                    group_key?: string | null
                    active?: boolean
                    updated_at?: string
                }
                Update: {
                    id?: string
                    meal_id?: string
                    source_id?: string
                    city_id?: string
                    price_cents?: number
                    currency?: string
                    old_price_cents?: number | null
                    delivery_fee_cents?: number
                    eta_minutes?: number | null
                    is_pickup?: boolean
                    source_url?: string
                    external_offer_id?: string | null
                    group_key?: string | null
                    active?: boolean
                    updated_at?: string
                }
            }
            price_history: {
                Row: {
                    id: string
                    offer_id: string
                    price_cents: number
                    recorded_at: string
                }
                Insert: {
                    id?: string
                    offer_id: string
                    price_cents: number
                    recorded_at?: string
                }
                Update: {
                    id?: string
                    offer_id?: string
                    price_cents?: number
                    recorded_at?: string
                }
            }
            click_events: {
                Row: {
                    id: string
                    offer_id: string
                    clicked_at: string
                    referrer: string | null
                    utm_source: string | null
                    utm_medium: string | null
                    utm_campaign: string | null
                    ip_hash: string | null
                    user_agent: string | null
                }
                Insert: {
                    id?: string
                    offer_id: string
                    clicked_at?: string
                    referrer?: string | null
                    utm_source?: string | null
                    utm_medium?: string | null
                    utm_campaign?: string | null
                    ip_hash?: string | null
                    user_agent?: string | null
                }
                Update: {
                    id?: string
                    offer_id?: string
                    clicked_at?: string
                    referrer?: string | null
                    utm_source?: string | null
                    utm_medium?: string | null
                    utm_campaign?: string | null
                    ip_hash?: string | null
                    user_agent?: string | null
                }
            }
        }
    }
}

// Helper types for joined queries
export type OfferWithDetails = Database['public']['Tables']['offers']['Row'] & {
    meal: Database['public']['Tables']['meals']['Row'] & {
        restaurant: Database['public']['Tables']['restaurants']['Row'] & {
            city: Database['public']['Tables']['cities']['Row']
        }
    }
    source: Database['public']['Tables']['sources']['Row']
}

export type MealWithRestaurant = Database['public']['Tables']['meals']['Row'] & {
    restaurant: Database['public']['Tables']['restaurants']['Row']
}
