/**
 * Wolt Integration Blueprint
 * --------------------------
 * Tämän integroimiseksi tarvitsemme seuraavat asiat:
 * 
 * 1. API Päätepisteet (Endpoints):
 *    - Esimerkiksi: https://restaurant-api.wolt.com/v1/pages/delivery-content
 * 
 * 2. Headerit & Autentikaatio:
 *    - User-Agent (Web-selaimen imitointi)
 *    - Wolt-Context (Sijaintitiedot, kieli)
 *    - Mahdollinen App-Token (jos API on suojattu)
 * 
 * 3. Sijaintitiedot (Lat/Lon):
 *    - Tarvitsemme käyttäjän koordinaatit hakeaksemme oikeat ravintolat.
 */

interface WoltRestaurant {
    venue: {
        id: string;
        name: string;
        delivery_price_int: number; // sentteinä
        estimate: number; // minuutteina
        delivery_price_highlight: boolean; // onko ilmainen?
    };
    items: {
        id: string;
        name: string;
        price: number;
        discount_price?: number;
    }[];
}

export class WoltClient {
    private baseUrl = 'https://restaurant-api.wolt.com/v1';

    /**
     * Hakee ravintolat ja tarjoukset sijainnin perusteella.
     * @param lat Leveysaste (Latitude)
     * @param lon Pituusaste (Longitude)
     */
    async fetchOffers(lat: number, lon: number) {
        // TÄMÄ ON ESIMERKKIKUTSU - VAATII OIKEAT HEADERIT TOIMIAKSEEN
        const url = `${this.baseUrl}/pages/delivery-content?lat=${lat}&lon=${lon}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...',
                    'wolt-context': 'LATITUDE,LONGITUDE', // Oikea konteksti tarvitaan
                }
            });

            if (!response.ok) {
                throw new Error(`Wolt API Error: ${response.status}`);
            }

            const data = await response.json();
            return this.normalizeData(data);
        } catch (error) {
            console.error('Failed to fetch from Wolt:', error);
            return [];
        }
    }

    /**
     * Muuntaa Woltin datan meidän sovelluksen muotoon (Offer)
     */
    private normalizeData(woltData: any) {
        // Logiikka datan mäppäämiseen meidän tietokantaan...
        return woltData.sections.map((section: any) => {
            // ...
            return {
                source: 'Wolt',
                meal: section.title,
                price: section.price,
                // ...
            };
        });
    }
}
