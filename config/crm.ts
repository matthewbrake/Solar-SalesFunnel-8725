import type { FormData, GoogleSolarData } from '../types';

/**
 * =================================================================================
 *
 *    C R M   D A T A   M A P P I N G
 *
 * =================================================================================
 *
 *  This file defines the logic for transforming the application's form data
 *  into a structured payload suitable for a Customer Relationship Management (CRM)
 *  system like Salesforce, HubSpot, or a custom backend.
 *
 *  By centralizing this mapping, you can easily adapt to different CRM requirements
 *  without changing the main application code.
 *
 */


// ---------------------------------------------------------------------------------
//  CRM Payload Interface
// ---------------------------------------------------------------------------------
//  Define the structure of the data you want to send to your CRM.
//  Use keys that match your CRM's field names (e.g., 'first_name' instead of 'firstName').
// ---------------------------------------------------------------------------------
interface CrmPayload {
    lead_source: string;
    first_name: string;
    last_name: string;
    email_address: string;
    phone_number: string;
    company_name?: string;
    full_address: string;
    address_latitude: number;
    address_longitude: number;
    service_of_interest: string;
    estimated_credit_score: string;
    customer_interest_level: string;
    average_monthly_bill: number;
    scheduled_appointment_utc?: string;
    solar_data_summary?: {
        est_first_year_savings: number;
        est_system_cost: number;
        payback_period_years: number;
        recommended_system_size_kw: number;
        max_solar_panels: number;
        usable_roof_area_sqft: number;
    };
    // Add any other custom fields your CRM requires
}


// ---------------------------------------------------------------------------------
//  Mapping Function
// ---------------------------------------------------------------------------------
//  This function takes the application's internal FormData and maps it to the
//  CrmPayload structure.
// ---------------------------------------------------------------------------------
export const mapFormDataToCrmPayload = (formData: FormData): CrmPayload => {
    
    // Helper to process solar data safely
    const getSolarSummary = (solarData: GoogleSolarData | null) => {
        if (!solarData) return undefined;
        
        const cashPurchaseAnalysis = solarData.financialAnalyses.find(
            (fin) => fin.financingOption === "CASH_PURCHASE"
        );
        
        if (!cashPurchaseAnalysis) return undefined;

        const recommendedConfig = solarData.solarPotential.solarPanelConfigs?.[0];

        return {
            est_first_year_savings: cashPurchaseAnalysis.cashPurchaseSavings.savings.savingsYear1.amount,
            est_system_cost: cashPurchaseAnalysis.cashPurchaseSavings.upfrontCost.amount,
            payback_period_years: cashPurchaseAnalysis.cashPurchaseSavings.paybackYears,
            recommended_system_size_kw: recommendedConfig ? parseFloat((recommendedConfig.yearlyEnergyDcKwh / 1200).toFixed(2)) : 0,
            max_solar_panels: solarData.solarPotential.maxPanelCount,
            usable_roof_area_sqft: Math.round(solarData.solarPotential.maxArrayAreaMeters2 * 10.764),
        };
    };
    
    const payload: CrmPayload = {
        lead_source: 'Sales Funnel Hero Web App',
        first_name: formData.firstName,
        last_name: formData.lastName,
        email_address: formData.email,
        phone_number: formData.phone,
        full_address: formData.address?.fullAddress || '',
        address_latitude: formData.address?.lat || 0,
        address_longitude: formData.address?.lng || 0,
        service_of_interest: formData.service || 'Not Specified',
        estimated_credit_score: formData.creditScore,
        customer_interest_level: formData.interestLevel,
        average_monthly_bill: formData.monthlyBill,
        // Convert date to a standard ISO string for backend compatibility
        scheduled_appointment_utc: formData.appointmentSlot?.toISOString(),
        solar_data_summary: getSolarSummary(formData.solarData),
    };

    // Only include company name if it was provided
    if (formData.companyName) {
        payload.company_name = formData.companyName;
    }

    return payload;
};
