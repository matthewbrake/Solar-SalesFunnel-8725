/**
 * =================================================================================
 *
 *    T H E M E   C O N F I G U R A T I O N
 *
 * =================================================================================
 *
 *  This file centralizes the design system for the application.
 *  The color and font values are now used by `tailwind.config.js`.
 *
 */

// ---------------------------------------------------------------------------------
//  Fonts
// ---------------------------------------------------------------------------------
export const fonts = {
    primary: "'Poppins', sans-serif",
    secondary: "'Inter', sans-serif",
};

// ---------------------------------------------------------------------------------
//  Colors
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
