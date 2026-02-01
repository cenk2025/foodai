export interface FoodOffer {
    id: string;
    title: string;
    description?: string;
    price: number;
    originalPrice?: number;
    image: string;
    currency: string;
    merchant: {
        name: string;
        id: string;
        location?: {
            lat: number;
            lon: number;
        };
    };
    delivery: {
        price: number;
        estimateMin: number;
        estimateMax: number;
    };
    url: string; // The "affiliate" link
}

export interface FoodProvider {
    name: string;
    baseUrl: string;
    /**
     * Fetches offers based on user location.
     */
    getOffers(lat: number, lon: number): Promise<FoodOffer[]>;

    /**
     * Generates a tracking link for a specific offer/merchant.
     */
    generateAffiliateLink(offerId: string): string;
}
