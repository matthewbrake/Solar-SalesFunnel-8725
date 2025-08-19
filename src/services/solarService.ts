import type { Address, GoogleSolarData } from '../types.ts';
import { GOOGLE_API_KEY, IS_API_KEY_VALID } from '../config/googleApiConfig';

// =================================================================================
//  Session-Based Cache for Solar API
// =================================================================================
const solarCache = new Map<string, GoogleSolarData>();

/**
 * Fetches building insights from the Google Solar API for a given address.
 * It intelligently uses a session-based cache to prevent redundant API calls
 * for the same location.
 *
 * @param address - The address object containing the latitude and longitude.
 * @returns A promise that resolves to the detailed solar insights data.
 * @throws An error if the API key is not configured, the network request fails,
 *         or if the API response indicates no building was found.
 */
export const getSolarData = async (address: Address): Promise<GoogleSolarData> => {
    // --- Step 1: Verify API Key is available before doing anything else ---
    if (!IS_API_KEY_VALID) {
        throw new Error("API key is not configured. Please set the API_KEY in the .env file as per the README.");
    }

    const { lat, lng } = address;
    const cacheKey = `${lat},${lng}`;

    // --- Step 2: Check the cache first ---
    if (solarCache.has(cacheKey)) {
        return solarCache.get(cacheKey)!;
    }
    
    // --- Step 3: Construct the API request URL ---
    // We use the `buildingInsights:findClosest` endpoint, which is robust for finding
    // the primary structure at a given lat/lng.
    const radiusMeters = 100; // Search radius to find the building
    const url = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&radiusMeters=${radiusMeters}&key=${GOOGLE_API_KEY}`;
    
    // --- Step 4: Perform the API call ---
    try {
        const response = await fetch(url);

        // Handle non-successful HTTP responses (e.g., 400, 403, 500)
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Solar API Error Response:', errorData);
            const errorMessage = errorData.error?.message || 'An unknown error occurred with the Google Solar API.';
            throw new Error(`Google Solar API request failed: ${errorMessage}`);
        }
        
        const data: GoogleSolarData = await response.json();
        
        // --- Step 5: Validate the API response data ---
        // It's possible to get a successful response but find no actual building data.
        if (!data.solarPotential) {
            throw new Error("No building with sufficient data found at this address. This can happen with new constructions or remote locations. Please try a different address.");
        }
        
        // --- Step 6: Cache the new data and return it ---
        solarCache.set(cacheKey, data); // Store the successful response in the cache
        
        return data;
    } catch (error) {
        console.error("❌ Fatal error during solar data fetch:", error);
        // Re-throw the error so it can be caught and handled by the UI component.
        throw error;
    }
};