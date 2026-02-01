import { FoodProvider, FoodOffer } from './types';

export const BurgerKingFi: FoodProvider = {
    name: 'Burger King Finland',
    baseUrl: 'https://burgerking.fi',

    async getOffers(lat: number, lon: number): Promise<FoodOffer[]> {
        // Burger King Finland typically has a "Coupons" section.
        // Integration usually involves parsing their public coupons page.
        console.log(`Fetching BK coupons for FI context`);
        return [];
    },

    generateAffiliateLink(offerId: string): string {
        return `https://burgerking.fi/campaigns/${offerId}`;
    }
};
