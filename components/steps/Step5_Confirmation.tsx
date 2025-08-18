
import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { mapFormDataToCrmPayload } from '../../config/crm';

const Step5Confirmation: React.FC = () => {
    const { formData } = useFormContext();

    // In a real app, this is where you would send the data to a CRM or backend.
    React.useEffect(() => {
        // 1. Map the internal form data to a clean, CRM-ready payload.
        const crmPayload = mapFormDataToCrmPayload(formData);
        
        console.log("========================================");
        console.log("✅ Final Form Submission Data (Internal)");
        console.log("========================================");
        console.log(formData);
        
        console.log("\n========================================");
        console.log("🚀 Mapped CRM-Ready Payload");
        console.log("========================================");
        console.log(crmPayload);
        
        // 2. In a real-world scenario, you would send this 'crmPayload' to your server.
        // Example:
        // fetch('/api/submit-lead', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(crmPayload),
        // })
        // .then(response => response.json())
        // .then(data => console.log('Successfully submitted to backend:', data))
        // .catch(error => console.error('Error submitting lead:', error));

    }, [formData]);

    return (
        <div className="text-center py-10 px-6">
            <svg className="mx-auto h-16 w-16 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-3xl font-extrabold text-text-primary">Thank You, {formData.firstName}!</h2>
            <p className="mt-2 text-lg text-text-secondary">Your request has been submitted successfully.</p>
            <div className="mt-6 text-left bg-secondary-light p-6 rounded-lg border border-border max-w-md mx-auto">
                <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border pb-2">Submission Summary</h3>
                <div className="space-y-2 text-sm text-text-secondary">
                    <p><strong>Service:</strong> {formData.service}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Address:</strong> {formData.address?.fullAddress}</p>
                    {formData.appointmentSlot && (
                        <p>
                            <strong>Appointment:</strong> {new Date(formData.appointmentSlot).toLocaleString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric'
                            })}
                        </p>
                    )}
                </div>
            </div>
            <p className="mt-6 text-text-secondary">
                A confirmation has been sent to your email. We will be in touch shortly to finalize your consultation.
            </p>
        </div>
    );
};

export default Step5Confirmation;