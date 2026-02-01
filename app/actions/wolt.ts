'use server'

interface WoltItem {
    title: string;
    track_id: string;
    image: {
        url: string;
        blurhash: string;
    };
    overlay?: string;
    venue?: {
        name: string;
        rating: {
            score: number;
        };
        price_range: number;
        currency: string;
        delivery_price_int: number;
        estimate_range: string;
        estimate: number;
        id: string;
        slug: string;
    };
}

export async function getWoltLiveOffers(lat: number = 60.1699, lon: number = 24.9384) {
    // Helsinki coordinates by default
    const url = `https://restaurant-api.wolt.com/v1/pages/venue-list?lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Origin': 'https://wolt.com',
                'Referer': 'https://wolt.com/',
                'wolt-context': 'true'
            },
            next: { revalidate: 0 } // No cache for live testing
        });

        if (!response.ok) {
            console.error(`Status: ${response.status}`);
            const text = await response.text();
            console.error(`Body: ${text}`);
            throw new Error(`Wolt API responded with ${response.status}`);
        }

        const data = await response.json();

        // Wolt API structure often changes. We need to find the section with items.
        // Usually data.sections contains different blocks (Discovery, Popular, etc.)
        const sections = data.sections || [];
        let items: WoltItem[] = [];

        // Try to find a section that has items (restaurants)
        for (const section of sections) {
            if (section.items && section.items.length > 0) {
                items = [...items, ...section.items];
            }
        }

        // Normalize to our format for preview
        const normalizedOffers = items
            .filter((item: WoltItem) => item.venue) // Must have venue info
            .slice(0, 10) // Limit to 10 for safety
            .map((item: WoltItem) => ({
                id: item.venue?.id,
                title: item.venue?.name || item.title,
                image: item.image?.url,
                rating: item.venue?.rating?.score,
                delivery_price: item.venue?.delivery_price_int
                    ? (item.venue.delivery_price_int / 100).toFixed(2)
                    : '0.00',
                estimate: item.venue?.estimate || 30,
                description: item.venue?.slug
            }));

        return { success: true, data: normalizedOffers };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
