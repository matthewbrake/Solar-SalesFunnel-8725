import React, { useState, useEffect, useRef } from 'react';
import { useFormContext } from '../../context/FormContext';
import { getSolarData } from '../../services/solarService';
import Button from '../ui/Button';
import type { SolarDataSummary, GoogleSolarData } from '../../types.ts';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';

// SVG Icons for data cards
const SavingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
const PanelsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const AreaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" /></svg>;
const CarbonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 17a5 5 0 01-4.88-6.265A6.5 6.5 0 0115.5 2.5a6.5 6.5 0 015.22 10.32A5 5 0 0115 22H9z"></path></svg>;
const CostIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const PaybackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SystemSizeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;


const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
        <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 className="text-xl font-semibold">Analyzing Your Roof...</h3>
        <p className="text-text-secondary max-w-sm">We're using satellite imagery and advanced models to calculate your home's solar potential. This may take a moment.</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string; onRetry: () => void; }> = ({ message, onRetry }) => (
    <div className="text-center p-8 bg-danger/10 border border-danger/20 rounded-lg">
        <h3 className="text-xl font-semibold text-danger">Analysis Failed</h3>
        <p className="text-danger/80 mt-2 mb-6 max-w-md mx-auto">{message}</p>
        <Button onClick={onRetry} variant="secondary">Try a Different Address</Button>
    </div>
);


const Step2aSolarAnalysis: React.FC = () => {
    const { formData, updateFormData, nextStep, prevStep } = useFormContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<SolarDataSummary | null>(null);
    const { isLoaded: isMapsLoaded } = useGoogleMaps();
    const mapRef = useRef<HTMLDivElement>(null);

    const fetchData = React.useCallback(async () => {
        if (!formData.address) {
            setError("Address not provided.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data: GoogleSolarData = await getSolarData(formData.address);
            updateFormData({ solarData: data });

            // Extract the cash purchase financial details
            const cashPurchaseAnalysis = data.financialAnalyses.find(
                (fin) => fin.financingOption === "CASH_PURCHASE"
            );

            if (!cashPurchaseAnalysis) {
                throw new Error("Detailed financial analysis for a cash purchase is not available for this location.");
            }

            const potential = data.solarPotential;
            // Get the recommended solar panel configuration for system size
            const recommendedConfig = potential.solarPanelConfigs?.[0];

            const newSummary: SolarDataSummary = {
                yearlySavings: cashPurchaseAnalysis.cashPurchaseSavings.savings.savingsYear1.amount,
                currencyCode: cashPurchaseAnalysis.cashPurchaseSavings.savings.savingsYear1.currencyCode,
                carbonOffset: data.carbonOffset?.treesPlanted || 0,
                maxPanelCount: potential.maxPanelCount,
                usableRoofArea: Math.round(potential.maxArrayAreaMeters2 * 10.764), // to sqft
                estimatedCost: cashPurchaseAnalysis.cashPurchaseSavings.upfrontCost.amount,
                paybackInYears: cashPurchaseAnalysis.cashPurchaseSavings.paybackYears,
                systemSizeKw: recommendedConfig ? parseFloat((recommendedConfig.yearlyEnergyDcKwh / 1200).toFixed(2)) : 0, // Approximate size
            };
            setSummary(newSummary);

        } catch (e: any) {
            setError(e.message || "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.address, updateFormData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    useEffect(() => {
        if (isMapsLoaded && mapRef.current && formData.solarData?.boundingBox) {
            const map = new window.google.maps.Map(mapRef.current, {
                mapTypeId: 'satellite',
                disableDefaultUI: true,
            });

            const bounds = {
                north: formData.solarData.boundingBox.ne.latitude,
                south: formData.solarData.boundingBox.sw.latitude,
                east: formData.solarData.boundingBox.ne.longitude,
                west: formData.solarData.boundingBox.sw.longitude,
            };
            map.fitBounds(bounds);

            formData.solarData.solarPotential?.solarPanelConfigs.forEach(config => {
                config.roofSegmentStats.forEach(segment => {
                    const segmentBounds = {
                        north: segment.boundingBox.ne.latitude,
                        south: segment.boundingBox.sw.latitude,
                        east: segment.boundingBox.ne.longitude,
                        west: segment.boundingBox.sw.longitude,
                    };
                    new window.google.maps.Rectangle({
                        strokeColor: '#FFC107',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FFC107',
                        fillOpacity: 0.35,
                        map,
                        bounds: segmentBounds,
                    });
                });
            });
        }
    }, [isMapsLoaded, formData.solarData]);

    const handleRetry = () => {
        // Go back to the previous step to allow entering a new address
        prevStep();
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay message={error} onRetry={handleRetry} />;
    }
    
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold">Your Solar Potential Analysis</h2>
                <p className="text-text-secondary mt-1">Based on your address: <span className="font-semibold">{formData.address?.fullAddress}</span></p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div ref={mapRef} className="h-96 w-full rounded-lg bg-secondary-light border border-border shadow-md">
                    {!isMapsLoaded && <div className="flex items-center justify-center h-full text-text-subtle">Loading Map...</div>}
                </div>
                
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DataCard icon={<SavingsIcon />} title="Est. First Year Savings" value={`$${summary.yearlySavings.toLocaleString()}`} subtitle={`in ${summary.currencyCode}`} />
                        <DataCard icon={<CostIcon />} title="Estimated System Cost" value={`$${summary.estimatedCost.toLocaleString()}`} subtitle="before incentives" />
                        <DataCard icon={<PaybackIcon />} title="Payback Period" value={`${summary.paybackInYears.toFixed(1)} Years`} subtitle="to recoup investment" />
                        <DataCard icon={<SystemSizeIcon />} title="Recommended System" value={`${summary.systemSizeKw} kW`} subtitle="estimated size" />
                        <DataCard icon={<PanelsIcon />} title="Max Solar Panels" value={summary.maxPanelCount.toString()} subtitle="that can fit on your roof" />
                        <DataCard icon={<AreaIcon />} title="Usable Roof Area" value={`${summary.usableRoofArea.toLocaleString()} sq. ft.`} subtitle="for solar installation" />
                        <DataCard icon={<CarbonIcon />} title="Carbon Offset" value={`${Math.round(summary.carbonOffset)} Trees`} subtitle="equivalent per year" />
                    </div>
                )}
            </div>
            
            <div className="bg-secondary-light p-4 rounded-lg text-sm text-text-secondary">
                <strong>Disclaimer:</strong> These are estimates based on available data and standard assumptions. A detailed on-site assessment is required for a final quote.
            </div>

            <div className="flex justify-between pt-4">
                <Button onClick={prevStep} variant="secondary">Back</Button>
                <Button onClick={nextStep}>Next Step</Button>
            </div>
        </div>
    );
};

interface DataCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    subtitle: string;
}

const DataCard: React.FC<DataCardProps> = ({ icon, title, value, subtitle }) => (
    <div className="bg-background-surface p-4 rounded-lg shadow-subtle border border-border flex items-start space-x-4">
        <div className="flex-shrink-0 pt-1">{icon}</div>
        <div>
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
            <p className="text-sm text-text-subtle">{subtitle}</p>
        </div>
    </div>
);

export default Step2aSolarAnalysis;