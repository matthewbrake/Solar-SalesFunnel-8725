/**
 * =================================================================================
 *
 *    T H E M E   C O N F I G U R A T I O N
 *
 * =================================================================================
 *
 *  This file centralizes the design system for the application.
 *  Edit the values here to easily and consistently change the look and feel
 *  across all components.
 *
 */

// ---------------------------------------------------------------------------------
//  Fonts
// ---------------------------------------------------------------------------------
//  - primary: Used for headings and primary text.
//  - secondary: Used for body copy and UI elements.
//  - Ensure you import these fonts in `index.html` from a service like Google Fonts.
// ---------------------------------------------------------------------------------
export const fonts = {
    primary: "'Poppins', sans-serif",
    secondary: "'Inter', sans-serif",
};

// ---------------------------------------------------------------------------------
//  Colors
// ---------------------------------------------------------------------------------
//  Define the color palette. These are used by Tailwind CSS.
//  The names are descriptive to make them easy to use in components.
// ---------------------------------------------------------------------------------
export const colors = {
    // Primary brand color for buttons, links, and highlights
    primary: {
        DEFAULT: '#0052cc', // A strong, accessible blue
        light: '#e6f0ff',
        dark: '#003e99',
    },
    // Secondary color for accents, secondary buttons
    secondary: {
        DEFAULT: '#172b4d', // A deep navy for contrast
        light: '#f4f5f7',
        dark: '#091e42',
    },
    // Background colors
    background: {
        DEFAULT: '#f8f9fa', // A very light grey for the page background
        surface: '#ffffff', // For cards and modals
    },
    // Text colors
    text: {
        primary: '#172b4d',   // High-contrast for headings
        secondary: '#505f79', // Softer for body copy
        subtle: '#6b778c',    // For placeholders and disabled text
        onPrimary: '#ffffff', // Text used on a primary color background
    },
    // Feedback colors
    success: '#00875a',
    danger: '#de350b',
    warning: '#ffab00',
    // Border colors
    border: '#dfe1e6',
};

// ---------------------------------------------------------------------------------
//  Tailwind CSS Configuration Object
// ---------------------------------------------------------------------------------
//  This object is used in a script tag in `index.html` to configure Tailwind's
//  default theme on the fly.
// ---------------------------------------------------------------------------------
export const tailwindThemeConfig = {
    theme: {
        extend: {
            fontFamily: {
                sans: fonts.secondary,
                heading: fonts.primary,
            },
            colors: {
                ...colors,
            },
            boxShadow: {
                'subtle': '0 1px 3px 0 rgba(9, 30, 66, 0.15), 0 0 1px 0 rgba(9, 30, 66, 0.3)',
                'card': '0 4px 8px 0 rgba(9, 30, 66, 0.1), 0 0 1px 0 rgba(9, 30, 66, 0.25)',
                'overlay': '0 8px 16px -4px rgba(9, 30, 66, 0.25), 0 0 1px 0 rgba(9, 30, 66, 0.31)',
            },
        },
    },
};
