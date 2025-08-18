// =================================================================================
//
//    G O O G L E   A P I   C O N F I G U R A T I O N
//
// =================================================================================
//
//  This file is the central hub for all Google API settings.
//
//  ---------------------------------------------------------------------------------
//  ** IMPORTANT: API KEY SECURITY **
//  ---------------------------------------------------------------------------------
//  For security, API keys should be stored in a `.env` file in a real project.
//  This prevents keys from being exposed in the code. Because this IDE doesn't
//  support `.env` files, we use the method below for testing purposes ONLY.
//
// =================================================================================


// ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
//
//  >>> PASTE YOUR API KEY HERE <<<
//  Replace the placeholder string on this line with your actual Google API Key.
//
export const GOOGLE_API_KEY = "PASTE_YOUR_GOOGLE_API_KEY_HERE";
//
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲


// --- DO NOT EDIT BELOW THIS LINE ---

/**
 * A constant placeholder value used for validation.
 * The application checks if GOOGLE_API_KEY is different from this value.
 * This MUST match the initial value of GOOGLE_API_KEY above.
 */
const API_KEY_PLACEHOLDER = "PASTE_YOUR_GOOGLE_API_KEY_HERE";


/**
 * A list of Google Maps JavaScript API libraries to load.
 *
 * - `places`: Enables the powerful address autocomplete functionality.
 * - `maps`: Enables the core map rendering, including satellite imagery and drawing shapes.
 */
export const GOOGLE_MAPS_LIBRARIES = "places,maps";


/**
 * A validation flag to check if the API key has been set correctly.
 * This prevents the app from making API calls with the default placeholder key.
 * This logic is now fixed and works as expected.
 */
export const IS_API_KEY_VALID = GOOGLE_API_KEY && GOOGLE_API_KEY !== API_KEY_PLACEHOLDER;


// --- Initial Check ---
if (!IS_API_KEY_VALID) {
    console.warn(
        `%c
+---------------------------------------------------------------------+
| [ CONFIGURATION NEEDED ] Google API Key is not set.                 |
|                                                                     |
| The application will not be able to fetch maps or solar data.       |
| Please edit the 'GOOGLE_API_KEY' variable in the file:              |
| 'config/googleApiConfig.ts' to add your key for testing.            |
+---------------------------------------------------------------------+
`,
        "color: orange; font-family: monospace;"
    );
}