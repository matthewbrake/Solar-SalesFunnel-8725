// Enum for the different services offered.
export enum ServiceType {
    Solar = 'Solar',
    HVAC = 'HVAC',
    Roofing = 'Roofing',
    SmartHome = 'Smart Home',
}

// Interface for the address object, populated by Google Places API.
export interface Address {
    fullAddress: string;
    lat: number;
    lng: number;
}

// Interface for file objects from the upload input.
export interface BillFile {
    file: File;
    preview: string;
}

// --- Detailed Google Solar API Types ---

interface LatLng {
    latitude: number;
    longitude: number;
}

interface BoundingBox {
    sw: LatLng;
    ne: LatLng;
}

interface RoofSegmentStat {
    boundingBox: BoundingBox;
    pitchDegrees: number;
    azimuthDegrees: number;
}

interface SolarPanelConfig {
    panelsCount: number;
    yearlyEnergyDcKwh: number;
    roofSegmentStats: RoofSegmentStat[];
}

interface SolarPotential {
    maxPanelCount: number;
    maxArrayAreaMeters2: number;
    solarPanelConfigs: SolarPanelConfig[];
}

// Represents a single financial analysis scenario from the API (e.g., cash purchase, financed)
interface FinancialAnalysis {
    monthlyBill: { amount: number, currencyCode: string };
    monthlyAverageEnergyBill: { amount: number, currencyCode: string };
    cashPurchaseSavings: {
        upfrontCost: { amount: number, currencyCode: string };
        paybackYears: number;
        savings: {
            savingsYear1: { amount: number, currencyCode: string };
            savingsYear20: { amount: number, currencyCode: string };
        }
    };
    financingOption: string; // "CASH_PURCHASE" or "FINANCED"
}


// This represents the full response from the buildingInsights:findClosest endpoint
export interface GoogleSolarData {
    name: string;
    center: LatLng;
    boundingBox: BoundingBox;
    imageryDate: { year: number; month: number; day: number };
    solarPotential: SolarPotential;
    // The API returns an array of financial scenarios
    financialAnalyses: FinancialAnalysis[];
    carbonOffset?: {
        treesPlanted: number;
    };
}


// --- Main Application Types ---

// Type for the entire form data collected through the funnel.
export type FormData = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    companyName: string;
    address: Address | null;
    service: ServiceType | null;
    creditScore: 'Excellent' | 'Good' | 'Fair' | '';
    interestLevel: 'Very Interested' | 'Interested' | 'Slightly Interested' | 'Just Browsing' | '';
    monthlyBill: number;
    bills: BillFile[];
    appointmentSlot: Date | null;
    solarData: GoogleSolarData | null;
};

// Type for the FormContext, including state and actions.
export type FormContextType = {
    step: number;
    formData: FormData;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateFormData: (data: Partial<FormData>) => void;
};

// Type definition for the processed solar data used for display in the UI.
export interface SolarDataSummary {
    yearlySavings: number;
    currencyCode: string;
    carbonOffset: number;
    maxPanelCount: number;
    usableRoofArea: number;
    estimatedCost: number;
    paybackInYears: number;
    systemSizeKw: number;
}

// Minimal Google Maps Places API types to satisfy TypeScript for Autocomplete.
declare global {
  namespace google.maps {
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
    }
    
    interface LatLngBounds {
        // This is a class, but we only need its literal representation for fitBounds
    }

    interface LatLngBoundsLiteral {
        east: number;
        north: number;
        south: number;
        west: number;
    }

    interface MapOptions {
      center?: LatLng | { lat: number; lng: number; };
      zoom?: number;
      mapTypeId?: string;
      disableDefaultUI?: boolean;
    }
    
    class Rectangle {
      constructor(opts?: RectangleOptions);
    }

    interface RectangleOptions {
      bounds: { north: number; south: number; east: number; west: number; };
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      fillColor?: string;
      fillOpacity?: number;
      map?: Map;
    }

    interface MapsEventListener {
      remove(): void;
    }

    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions);
        getPlace(): PlaceResult;
        addListener(eventName: string, handler: () => void): MapsEventListener;
      }

      interface AutocompleteOptions {
        types?: string[];
        componentRestrictions?: { country: string | string[] };
      }

      interface PlaceResult {
        formatted_address?: string;
        geometry?: {
          location: LatLng;
        };
      }
    }
  }

  interface Window {
    google: typeof google;
    initMap?: () => void;
  }
}
