-- FoodAi Demo Data Seed
-- Run this after the initial schema migration

-- Insert cities
INSERT INTO cities (name, country_code) VALUES
    ('Helsinki', 'FI'),
    ('Espoo', 'FI'),
    ('Vantaa', 'FI'),
    ('Tampere', 'FI'),
    ('Turku', 'FI'),
    ('Oulu', 'FI');

-- Insert demo sources
INSERT INTO sources (name, type, base_url, logo_url) VALUES
    ('DemoEats', 'demo', 'https://demoeats.fi', '/logos/demoeats.svg'),
    ('CheapBites', 'demo', 'https://cheapbites.fi', '/logos/cheapbites.svg'),
    ('FastFoodFinder', 'demo', 'https://fastfoodfinder.fi', '/logos/fastfoodfinder.svg'),
    ('LocalDeals', 'demo', 'https://localdeals.fi', '/logos/localdeals.svg');

-- Insert restaurants (20 across cities)
DO $$
DECLARE
    helsinki_id UUID;
    espoo_id UUID;
    vantaa_id UUID;
    tampere_id UUID;
    turku_id UUID;
    oulu_id UUID;
BEGIN
    SELECT id INTO helsinki_id FROM cities WHERE name = 'Helsinki';
    SELECT id INTO espoo_id FROM cities WHERE name = 'Espoo';
    SELECT id INTO vantaa_id FROM cities WHERE name = 'Vantaa';
    SELECT id INTO tampere_id FROM cities WHERE name = 'Tampere';
    SELECT id INTO turku_id FROM cities WHERE name = 'Turku';
    SELECT id INTO oulu_id FROM cities WHERE name = 'Oulu';

    -- Helsinki restaurants
    INSERT INTO restaurants (city_id, name, address, rating, tags) VALUES
        (helsinki_id, 'Pizza Paradiso', 'Mannerheimintie 1, Helsinki', 4.5, ARRAY['italian', 'pizza', 'fast']),
        (helsinki_id, 'Kebab King', 'Aleksanterinkatu 15, Helsinki', 4.2, ARRAY['kebab', 'fast', 'halal']),
        (helsinki_id, 'Sushi Station', 'Kamppi, Helsinki', 4.7, ARRAY['japanese', 'sushi', 'healthy']),
        (helsinki_id, 'Burger Boulevard', 'Iso Roobertinkatu 20, Helsinki', 4.3, ARRAY['burgers', 'american', 'fast']);

    -- Espoo restaurants
    INSERT INTO restaurants (city_id, name, address, rating, tags) VALUES
        (espoo_id, 'Espoo Pizza House', 'Tapiola, Espoo', 4.1, ARRAY['italian', 'pizza']),
        (espoo_id, 'Green Bowl', 'Leppävaara, Espoo', 4.6, ARRAY['healthy', 'vegan', 'salads']),
        (espoo_id, 'Kebab Express', 'Espoon keskus, Espoo', 4.0, ARRAY['kebab', 'fast', 'halal']),
        (espoo_id, 'Asian Fusion', 'Otaniemi, Espoo', 4.4, ARRAY['asian', 'fusion', 'healthy']);

    -- Vantaa restaurants
    INSERT INTO restaurants (city_id, name, address, rating, tags) VALUES
        (vantaa_id, 'Vantaa Grill', 'Tikkurila, Vantaa', 4.2, ARRAY['grill', 'fast']),
        (vantaa_id, 'Pasta Palace', 'Myyrmäki, Vantaa', 4.3, ARRAY['italian', 'pasta']),
        (vantaa_id, 'Sushi Corner', 'Jumbo, Vantaa', 4.5, ARRAY['japanese', 'sushi']),
        (vantaa_id, 'Veggie Delight', 'Hakunila, Vantaa', 4.7, ARRAY['vegan', 'vegetarian', 'healthy']);

    -- Tampere restaurants
    INSERT INTO restaurants (city_id, name, address, rating, tags) VALUES
        (tampere_id, 'Tampere Pizza Co', 'Keskustori, Tampere', 4.4, ARRAY['italian', 'pizza']),
        (tampere_id, 'Nordic Bites', 'Koskikeskus, Tampere', 4.6, ARRAY['nordic', 'healthy']),
        (tampere_id, 'Quick Kebab', 'Hämeenkatu, Tampere', 4.1, ARRAY['kebab', 'fast', 'halal']),
        (tampere_id, 'Burger Station', 'Ratina, Tampere', 4.3, ARRAY['burgers', 'american']);

    -- Turku restaurants
    INSERT INTO restaurants (city_id, name, address, rating, tags) VALUES
        (turku_id, 'Turku Taste', 'Kauppatori, Turku', 4.5, ARRAY['finnish', 'local']),
        (turku_id, 'Mediterranean Kitchen', 'Yliopistonkatu, Turku', 4.4, ARRAY['mediterranean', 'healthy']),
        (turku_id, 'Sushi Bay', 'Hansa, Turku', 4.6, ARRAY['japanese', 'sushi']);

    -- Oulu restaurants
    INSERT INTO restaurants (city_id, name, address, rating, tags) VALUES
        (oulu_id, 'Oulu Eats', 'Rotuaari, Oulu', 4.3, ARRAY['finnish', 'local']),
        (oulu_id, 'Pizza North', 'Kauppurienkatu, Oulu', 4.2, ARRAY['italian', 'pizza']);
END $$;

-- Insert meals (80 meals across restaurants)
DO $$
DECLARE
    r RECORD;
    meal_count INT;
BEGIN
    FOR r IN SELECT id, name, tags FROM restaurants LOOP
        meal_count := 0;
        
        -- Pizza restaurants
        IF 'pizza' = ANY(r.tags) THEN
            INSERT INTO meals (restaurant_id, name, description, diet_flags, allergens, image_path) VALUES
                (r.id, 'Margherita Pizza', 'Classic tomato and mozzarella', ARRAY['vegetarian'], ARRAY['gluten', 'dairy'], 'meals/margherita.jpg'),
                (r.id, 'Pepperoni Pizza', 'Spicy pepperoni with cheese', ARRAY[]::TEXT[], ARRAY['gluten', 'dairy'], 'meals/pepperoni.jpg'),
                (r.id, 'Vegetarian Special', 'Loaded with fresh vegetables', ARRAY['vegetarian'], ARRAY['gluten', 'dairy'], 'meals/veggie-pizza.jpg'),
                (r.id, 'Hawaiian Pizza', 'Ham and pineapple', ARRAY[]::TEXT[], ARRAY['gluten', 'dairy'], 'meals/hawaiian.jpg');
            meal_count := 4;
        END IF;

        -- Kebab restaurants
        IF 'kebab' = ANY(r.tags) THEN
            INSERT INTO meals (restaurant_id, name, description, diet_flags, allergens, image_path) VALUES
                (r.id, 'Chicken Kebab', 'Grilled chicken with fresh salad', ARRAY['halal'], ARRAY['gluten'], 'meals/chicken-kebab.jpg'),
                (r.id, 'Beef Kebab', 'Tender beef strips', ARRAY['halal'], ARRAY['gluten'], 'meals/beef-kebab.jpg'),
                (r.id, 'Falafel Wrap', 'Crispy falafel with tahini', ARRAY['vegan', 'halal'], ARRAY['gluten', 'sesame'], 'meals/falafel.jpg'),
                (r.id, 'Mixed Kebab Plate', 'Combination of meats', ARRAY['halal'], ARRAY['gluten'], 'meals/mixed-kebab.jpg');
            meal_count := 4;
        END IF;

        -- Sushi restaurants
        IF 'sushi' = ANY(r.tags) THEN
            INSERT INTO meals (restaurant_id, name, description, diet_flags, allergens, image_path) VALUES
                (r.id, 'Salmon Nigiri Set', 'Fresh salmon sushi', ARRAY[]::TEXT[], ARRAY['fish', 'soy'], 'meals/salmon-nigiri.jpg'),
                (r.id, 'California Roll', 'Crab and avocado roll', ARRAY[]::TEXT[], ARRAY['fish', 'soy'], 'meals/california-roll.jpg'),
                (r.id, 'Vegetarian Maki', 'Cucumber and avocado', ARRAY['vegetarian'], ARRAY['soy'], 'meals/veggie-maki.jpg'),
                (r.id, 'Tuna Sashimi', 'Premium tuna slices', ARRAY[]::TEXT[], ARRAY['fish', 'soy'], 'meals/tuna-sashimi.jpg');
            meal_count := 4;
        END IF;

        -- Burger restaurants
        IF 'burgers' = ANY(r.tags) THEN
            INSERT INTO meals (restaurant_id, name, description, diet_flags, allergens, image_path) VALUES
                (r.id, 'Classic Cheeseburger', 'Beef patty with cheese', ARRAY[]::TEXT[], ARRAY['gluten', 'dairy'], 'meals/cheeseburger.jpg'),
                (r.id, 'Bacon Burger', 'Double bacon and cheese', ARRAY[]::TEXT[], ARRAY['gluten', 'dairy'], 'meals/bacon-burger.jpg'),
                (r.id, 'Veggie Burger', 'Plant-based patty', ARRAY['vegetarian'], ARRAY['gluten', 'soy'], 'meals/veggie-burger.jpg'),
                (r.id, 'Chicken Burger', 'Crispy chicken fillet', ARRAY[]::TEXT[], ARRAY['gluten'], 'meals/chicken-burger.jpg');
            meal_count := 4;
        END IF;

        -- Healthy/Vegan restaurants
        IF 'vegan' = ANY(r.tags) OR 'healthy' = ANY(r.tags) THEN
            INSERT INTO meals (restaurant_id, name, description, diet_flags, allergens, image_path) VALUES
                (r.id, 'Buddha Bowl', 'Quinoa, veggies, tahini', ARRAY['vegan', 'gluten_free'], ARRAY['sesame'], 'meals/buddha-bowl.jpg'),
                (r.id, 'Green Salad', 'Fresh mixed greens', ARRAY['vegan', 'gluten_free'], ARRAY[]::TEXT[], 'meals/green-salad.jpg'),
                (r.id, 'Smoothie Bowl', 'Acai and berries', ARRAY['vegan', 'gluten_free'], ARRAY[]::TEXT[], 'meals/smoothie-bowl.jpg'),
                (r.id, 'Tofu Stir-Fry', 'Asian-style tofu and vegetables', ARRAY['vegan'], ARRAY['soy'], 'meals/tofu-stirfry.jpg');
            meal_count := 4;
        END IF;

        -- Pasta restaurants
        IF 'pasta' = ANY(r.tags) THEN
            INSERT INTO meals (restaurant_id, name, description, diet_flags, allergens, image_path) VALUES
                (r.id, 'Spaghetti Carbonara', 'Creamy bacon pasta', ARRAY[]::TEXT[], ARRAY['gluten', 'dairy', 'eggs'], 'meals/carbonara.jpg'),
                (r.id, 'Penne Arrabbiata', 'Spicy tomato sauce', ARRAY['vegetarian'], ARRAY['gluten'], 'meals/arrabbiata.jpg'),
                (r.id, 'Lasagna', 'Layered meat and cheese', ARRAY[]::TEXT[], ARRAY['gluten', 'dairy'], 'meals/lasagna.jpg'),
                (r.id, 'Pesto Pasta', 'Basil pesto with pine nuts', ARRAY['vegetarian'], ARRAY['gluten', 'dairy', 'nuts'], 'meals/pesto-pasta.jpg');
            meal_count := 4;
        END IF;

        -- Default meals for other restaurants
        IF meal_count = 0 THEN
            INSERT INTO meals (restaurant_id, name, description, diet_flags, allergens, image_path) VALUES
                (r.id, 'House Special', 'Chef''s recommendation', ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'meals/house-special.jpg'),
                (r.id, 'Daily Lunch', 'Today''s special', ARRAY[]::TEXT[], ARRAY[]::TEXT[], 'meals/daily-lunch.jpg'),
                (r.id, 'Soup of the Day', 'Fresh homemade soup', ARRAY['vegetarian'], ARRAY[]::TEXT[], 'meals/soup.jpg'),
                (r.id, 'Grilled Chicken', 'Tender grilled chicken', ARRAY['gluten_free'], ARRAY[]::TEXT[], 'meals/grilled-chicken.jpg');
        END IF;
    END LOOP;
END $$;

-- Insert offers (120 offers with varied pricing)
DO $$
DECLARE
    m RECORD;
    s RECORD;
    city_id_var UUID;
    base_price INT;
    source_count INT := 0;
BEGIN
    FOR m IN SELECT id, restaurant_id, name FROM meals LOOP
        -- Get the city_id for this meal's restaurant
        SELECT r.city_id INTO city_id_var FROM restaurants r WHERE r.id = m.restaurant_id;
        
        -- Generate a base price between 5€ and 20€
        base_price := (500 + (random() * 1500)::INT);
        
        source_count := 0;
        
        -- Create 1-3 offers per meal across different sources
        FOR s IN SELECT id, name FROM sources ORDER BY random() LIMIT (1 + (random() * 2)::INT) LOOP
            source_count := source_count + 1;
            
            -- Vary price slightly per source
            INSERT INTO offers (
                meal_id, 
                source_id, 
                city_id, 
                price_cents, 
                old_price_cents,
                delivery_fee_cents,
                eta_minutes,
                is_pickup,
                source_url,
                external_offer_id,
                group_key,
                active
            ) VALUES (
                m.id,
                s.id,
                city_id_var,
                base_price + ((random() * 400 - 200)::INT), -- Vary by ±2€
                CASE WHEN random() > 0.7 THEN base_price + ((random() * 500)::INT) ELSE NULL END, -- 30% have old price
                (random() * 300)::INT, -- 0-3€ delivery fee
                (20 + (random() * 40)::INT), -- 20-60 minutes
                random() > 0.7, -- 30% pickup
                'https://' || lower(replace(s.name, ' ', '')) || '.fi/meal/' || m.id::TEXT,
                'EXT-' || substring(md5(random()::TEXT) from 1 for 8),
                md5(m.name), -- Group key based on meal name for comparison
                true
            );
        END LOOP;
    END LOOP;
END $$;

-- Insert price history for 30 random offers
DO $$
DECLARE
    o RECORD;
    days_back INT;
    historical_price INT;
BEGIN
    FOR o IN SELECT id, price_cents FROM offers ORDER BY random() LIMIT 30 LOOP
        -- Create 7-14 historical price points
        FOR days_back IN 1..(7 + (random() * 7)::INT) LOOP
            -- Price fluctuates ±20% from current price
            historical_price := o.price_cents + ((random() * 0.4 - 0.2) * o.price_cents)::INT;
            
            INSERT INTO price_history (offer_id, price_cents, recorded_at) VALUES (
                o.id,
                historical_price,
                NOW() - (days_back || ' days')::INTERVAL
            );
        END LOOP;
        
        -- Add current price as latest entry
        INSERT INTO price_history (offer_id, price_cents, recorded_at) VALUES (
            o.id,
            o.price_cents,
            NOW()
        );
    END LOOP;
END $$;

-- Note: Meal images should be uploaded to Supabase Storage bucket 'meal-images'
-- You can use the admin demo page to upload images or use the Supabase CLI
