-- FoodAi Database Schema
-- Initial migration for Trivago-style food price comparison app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cities table
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    country_code TEXT DEFAULT 'FI',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sources (platforms/aggregators)
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('delivery_platform', 'restaurant_site', 'affiliate_feed', 'demo')),
    base_url TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restaurants
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    rating NUMERIC(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meals
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    diet_flags TEXT[] DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}',
    image_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offers (the core comparison data)
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
    source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    price_cents INT NOT NULL CHECK (price_cents >= 0),
    currency TEXT DEFAULT 'EUR',
    old_price_cents INT CHECK (old_price_cents IS NULL OR old_price_cents >= 0),
    delivery_fee_cents INT DEFAULT 0 CHECK (delivery_fee_cents >= 0),
    eta_minutes INT CHECK (eta_minutes IS NULL OR eta_minutes >= 0),
    is_pickup BOOLEAN DEFAULT false,
    source_url TEXT NOT NULL,
    external_offer_id TEXT,
    group_key TEXT,
    active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price history for tracking
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
    price_cents INT NOT NULL CHECK (price_cents >= 0),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Click tracking for commission attribution
CREATE TABLE click_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT NOW(),
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    ip_hash TEXT,
    user_agent TEXT
);

-- Indexes for performance
CREATE INDEX idx_offers_city_price ON offers(city_id, price_cents);
CREATE INDEX idx_offers_meal ON offers(meal_id);
CREATE INDEX idx_offers_source ON offers(source_id);
CREATE INDEX idx_offers_group_key ON offers(group_key) WHERE group_key IS NOT NULL;
CREATE INDEX idx_offers_active ON offers(active) WHERE active = true;
CREATE INDEX idx_price_history_offer_time ON price_history(offer_id, recorded_at);
CREATE INDEX idx_click_events_offer_time ON click_events(offer_id, clicked_at);
CREATE INDEX idx_restaurants_city ON restaurants(city_id);
CREATE INDEX idx_meals_restaurant ON meals(restaurant_id);

-- Enable Row Level Security
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access
CREATE POLICY "Public can read cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Public can read sources" ON sources FOR SELECT USING (true);
CREATE POLICY "Public can read restaurants" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Public can read meals" ON meals FOR SELECT USING (true);
CREATE POLICY "Public can read active offers" ON offers FOR SELECT USING (active = true);
CREATE POLICY "Public can read price history" ON price_history FOR SELECT USING (true);

-- RLS Policies: Admin write access (authenticated users with admin role)
-- Note: You'll need to set up a custom claim or use Supabase Auth metadata
CREATE POLICY "Authenticated admins can insert cities" ON cities FOR INSERT 
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Authenticated admins can update cities" ON cities FOR UPDATE 
    USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Authenticated admins can delete cities" ON cities FOR DELETE 
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Authenticated admins can insert sources" ON sources FOR INSERT 
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Authenticated admins can update sources" ON sources FOR UPDATE 
    USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Authenticated admins can delete sources" ON sources FOR DELETE 
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Authenticated admins can insert restaurants" ON restaurants FOR INSERT 
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Authenticated admins can update restaurants" ON restaurants FOR UPDATE 
    USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Authenticated admins can delete restaurants" ON restaurants FOR DELETE 
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Authenticated admins can insert meals" ON meals FOR INSERT 
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Authenticated admins can update meals" ON meals FOR UPDATE 
    USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Authenticated admins can delete meals" ON meals FOR DELETE 
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Authenticated admins can insert offers" ON offers FOR INSERT 
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Authenticated admins can update offers" ON offers FOR UPDATE 
    USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Authenticated admins can delete offers" ON offers FOR DELETE 
    USING (auth.jwt() ->> 'role' = 'admin');

-- Click events can be inserted by anyone (will be done server-side with service role)
-- We'll handle this via server actions, not client-side RLS
CREATE POLICY "Service role can insert click events" ON click_events FOR INSERT 
    WITH CHECK (true);

-- Storage bucket for meal images will be created via Supabase dashboard or CLI
-- Bucket name: meal-images
-- Public: true
-- Allowed MIME types: image/jpeg, image/png, image/webp
-- Max file size: 5MB
