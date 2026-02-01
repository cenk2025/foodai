/**
 * Virallinen Wolt Partner API Integraatio
 * -------------------------------------
 * Jos teet sopimuksen Woltin kanssa, integrointi muuttuu huomattavasti helpommaksi ja vakaammaksi.
 * 
 * Saamasi edut:
 * 1. API Avaimet (API Key): Ei enää kikkailua headerien kanssa.
 * 2. Dokumentaatio: Selkeät ohjeet siitä, mistä tiedot löytyvät.
 * 3. Webhookit: Wolt ilmoittaa meille heti kun hinnat muuttuvat (ei tarvitse kysellä jatkuvasti).
 * 4. Komissioseuranta: Saamme uniikit linkit, jotka seuraavat myyntiä automaattisesti.
 */

export class WoltOfficialClient {
    private apiKey: string;
    private partnerId: string; // FoodAi:n tunnus Woltin järjestelmässä

    constructor(apiKey: string, partnerId: string) {
        this.apiKey = apiKey;
        this.partnerId = partnerId;
    }

    /**
     * Hakee ravintolat virallista reittiä pitkin.
     * Tämä on paljon nopeampaa ja luotettavampaa.
     */
    async getCatalog(lat: number, lon: number) {
        const response = await fetch(`https://api.wolt.com/v1/partners/${this.partnerId}/inventory?lat=${lat}&lon=${lon}`, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Accept': 'application/json'
            }
        });
        return response.json();
    }

    /**
     * Luo seurantalinkin komissiota varten.
     * Kun käyttäjä klikkaa "Katso Tarjous", hänet ohjataan tähän osoitteeseen.
     */
    generateTrackingLink(restaurantId: string, offerId: string): string {
        // Esimerkki: wolt.com/fi/fin/helsinki/restaurant/mcdonalds?utm_source=foodai&utm_medium=affiliate
        return `https://wolt.com/open/venue/${restaurantId}?utm_source=foodai&utm_campaign=${offerId}`;
    }
}
