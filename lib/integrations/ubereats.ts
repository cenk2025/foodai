import { FoodProvider, FoodOffer } from './types';

export const UberEatsFi: FoodProvider = {
    name: 'Uber Eats Finland',
    baseUrl: 'https://www.ubereats.com/fi',

    async getOffers(lat: number, lon: number): Promise<FoodOffer[]> {
        // Uber Eats is notoriously difficult to scrape.
        // Official Uber Eats API is the best route.
        console.log(`Fetching Uber Eats feed for ${lat}, ${lon}`);
        return [];
    },

    generateAffiliateLink(offerId: string): string {
        // Uber uses specialized deep links.
        return `https://www.ubereats.com/fi/store/${offerId}?utm_source=foodai`;
    }
};
