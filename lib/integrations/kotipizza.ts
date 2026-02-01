import { FoodProvider, FoodOffer } from './types';

export const Kotipizza: FoodProvider = {
    name: 'Kotipizza',
    baseUrl: 'https://www.kotipizza.fi',

    async getOffers(lat: number, lon: number): Promise<FoodOffer[]> {
        // Kotipizza has a structured API for their online store.
        // We can fetch "Kotijoukot" offers or general campaigns.
        console.log(`Checking Kotipizza generic offers`);
        return [];
    },

    generateAffiliateLink(offerId: string): string {
        return `https://www.kotipizza.fi/tuotteet/${offerId}?ref=foodai`;
    }
};
