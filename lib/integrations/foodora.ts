import { FoodProvider, FoodOffer } from './types';

export const FoodoraFi: FoodProvider = {
    name: 'Foodora Finland',
    baseUrl: 'https://www.foodora.fi',

    async getOffers(lat: number, lon: number): Promise<FoodOffer[]> {
        // TODO: Implement Foodora API or Scraping logic
        // Endpoint hint: https://www.foodora.fi/api/v5/vendors?latitude=...
        console.log(`Fetching Foodora offers for ${lat}, ${lon}`);
        return [];
    },

    generateAffiliateLink(offerId: string): string {
        // Foodora typically uses Impact.com or similar for affiliate tracking
        return `https://www.foodora.fi/restaurant/${offerId}?utm_source=foodai`;
    }
};
