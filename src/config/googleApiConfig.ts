// =================================================================================
//
//    G O O G L E   A P I   C O N F I G U R A T I O N
//
// =================================================================================
//
//  This file is the central hub for all Google API settings.
//
//  The API key is loaded from an environment variable for security.
//  See the README.md file for instructions on how to set up your `.env` file.
//
// =================================================================================


/**
 * Loads the Google API key from the environment variables.
 * The Vite build tool makes this available on the `process.env` object.
 */
export const GOOGLE_API_KEY = process.env.API_KEY;


/**
 * A list of Google Maps JavaScript API libraries to load.
 *
 * - `places`: Enables the powerful address autocomplete functionality.
 * - `maps`: Enables the core map rendering, including satellite imagery and drawing shapes.
 */
export const GOOGLE_MAPS_LIBRARIES = "places,maps";


/**
 * A validation flag to check if the API key has been set correctly.
 * This prevents the app from making API calls without a valid key.
 */
export const IS_API_KEY_VALID = !!GOOGLE_API_KEY;
