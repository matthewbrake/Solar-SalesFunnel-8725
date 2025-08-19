

import React, { useEffect, useRef } from 'react';
import { useFormContext } from '../../context/FormContext';
import { mapFormDataToCrmPayload } from '../../config/crm';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import { ServiceType } from '../../types.ts';

const Step5Confirmation: React.FC = () => {
    const { formData } = useFormContext();
    const { isLoaded: isMapsLoaded } = useGoogleMaps();
    const mapRef = useRef<HTMLDivElement>(null);
    const isSolarPath = formData.service === ServiceType.Solar;

    // In a real app, this is where you would send the data to a CRM or backend.
    useEffect(() => {
        const crmPayload = mapFormDataToCrmPayload(formData);
        // This is where you would send `crmPayload` to your backend API.
        console.log("🚀 Mapped CRM-Ready Payload:", crmPayload);
    }, [formData]);

    // Effect to render the map for solar users
    useEffect(() => {
        if (isSolarPath && isMapsLoaded && mapRef.current && formData.solarData?.boundingBox) {
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
    }, [isSolarPath, isMapsLoaded, formData.solarData]);

    return (
        <div className="text-center py-10 px-6">
            <svg className="mx-auto h-16 w-16 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-3xl font-extrabold">Thank You, {formData.firstName}!</h2>
            <p className="mt-2 text-lg text-text-secondary">Your request has been submitted successfully.</p>
            
            {isSolarPath && formData.solarData && (
                <div className="mt-6 border rounded-lg overflow-hidden shadow-md max-w-md mx-auto">
                    <div ref={mapRef} className="h-64 w-full bg-secondary-light">
                        {!isMapsLoaded && <div className="flex items-center justify-center h-full text-text-subtle">Loading Map...</div>}
                    </div>
                </div>
            )}

            <div className="mt-6 text-left bg-secondary-light p-6 rounded-lg border border-border max-w-md mx-auto">
                <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Submission Summary</h3>
                <div className="space-y-3 text-sm text-text-secondary">
                    <SummaryRow label="Service" value={formData.service} />
                    <SummaryRow label="Email" value={formData.email} />
                    <SummaryRow label="Address" value={formData.address?.fullAddress} />
                    {formData.appointmentSlot && (
                        <SummaryRow label="Appointment" value={new Date(formData.appointmentSlot).toLocaleString('en-US', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
                            })} />
                    )}
                </div>
            </div>
            <p className="mt-6 text-text-secondary">
                A confirmation has been sent to your email. We will be in touch shortly to finalize your consultation.
            </p>
        </div>
    );
};

const SummaryRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
    value ? (
        <div className="flex justify-between">
            <strong className="text-text-primary">{label}:</strong>
            <span className="text-right">{value}</span>
        </div>
    ) : null
);

export default Step5Confirmation;