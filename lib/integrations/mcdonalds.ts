import { FoodProvider, FoodOffer } from './types';

export const McDonaldsFi: FoodProvider = {
    name: "McDonald's Finland",
    baseUrl: 'https://www.mcdonalds.com/fi',

    async getOffers(lat: number, lon: number): Promise<FoodOffer[]> {
        // McDonald's mobile app API is often used here.
        // They have specific "Deals" section in the app.
        console.log(`Fetching McDonalds deals near ${lat}, ${lon}`);
        return [];
    },

    generateAffiliateLink(offerId: string): string {
        // Deep link to the app or website coupon
        return `https://www.mcdonalds.com/fi/fi-fi/deals.html`;
    }
};
