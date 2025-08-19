import { useState, useEffect } from 'react';
import { GOOGLE_API_KEY, GOOGLE_MAPS_LIBRARIES, IS_API_KEY_VALID } from '../config/googleApiConfig';

let isGoogleMapsApiLoaded = false;
let googleMapsApiPromise: Promise<void> | null = null;

export const useGoogleMaps = () => {
    const [isLoaded, setIsLoaded] = useState(isGoogleMapsApiLoaded);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Immediately set an error if the key is known to be invalid, and stop.
        if (!IS_API_KEY_VALID) {
            setError(new Error("Configuration needed: Google API Key is not set. Please add it to the .env file."));
            return;
        }

        if (isGoogleMapsApiLoaded) {
            setIsLoaded(true);
            return;
        }

        if (!googleMapsApiPromise) {
            googleMapsApiPromise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=${GOOGLE_MAPS_LIBRARIES}&callback=initMap`;
                script.async = true;
                script.defer = true;
                
                // The callback function that Google Maps API will call upon loading.
                window.initMap = () => {
                    isGoogleMapsApiLoaded = true;
                    setIsLoaded(true);
                    resolve();
                };

                script.onerror = () => {
                    const err = new Error("Failed to load Google Maps script. Check network connection and API key validity.");
                    setError(err);
                    googleMapsApiPromise = null; // Reset promise on failure
                    reject(err);
                };

                document.head.appendChild(script);
            });
        }
        
        googleMapsApiPromise.catch(setError);
    }, []);

    return { isLoaded, error };
};
