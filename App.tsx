
import React from 'react';
import { FormProvider, useFormContext } from './context/FormContext';
import Step1ContactInfo from './components/steps/Step1_ContactInfo';
import Step2aSolarAnalysis from './components/steps/Step2a_SolarAnalysis';
import Step3Qualification from './components/steps/Step3_Qualification';
import Step4Scheduling from './components/steps/Step4_Scheduling';
import Step5Confirmation from './components/steps/Step5_Confirmation';
import ProgressBar from './components/ui/ProgressBar';
import { ServiceType } from './types';

// The main application component that controls the flow of the funnel.
const AppController: React.FC = () => {
    const { step, formData } = useFormContext();

    const isSolarPath = formData.service === ServiceType.Solar;
    const totalSteps = isSolarPath ? 5 : 4;

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1ContactInfo />;
            case 2:
                // Conditional step rendering based on service selection
                if (isSolarPath) {
                    return <Step2aSolarAnalysis />;
                }
                // For non-solar paths, we skip to the qualification step.
                // The step number is adjusted in the context's nextStep function.
                return <Step3Qualification />;
            case 3:
                 if (isSolarPath) {
                    return <Step3Qualification />;
                }
                return <Step4Scheduling />;
            case 4:
                if (isSolarPath) {
                    return <Step4Scheduling />;
                }
                return <Step5Confirmation />;
            case 5:
                 if (isSolarPath) {
                    return <Step5Confirmation />;
                }
                return null; // Should not be reached in non-solar path
            default:
                return <Step1ContactInfo />;
        }
    };

    return (
        <div className="bg-background min-h-screen font-secondary text-text-secondary flex items-center justify-center p-4">
            <div className="w-full max-w-3xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-text-primary">Get Your Free Estimate</h1>
                    <p className="text-text-secondary mt-2 text-lg">Complete the steps below to receive your personalized quote.</p>
                </header>
                <main className="bg-background-surface rounded-2xl shadow-card p-8 sm:p-10 transition-all duration-500">
                    {step < totalSteps && step > 1 && <ProgressBar currentStep={step-1} totalSteps={totalSteps - 1} />}
                    {renderStep()}
                </main>
                 <footer className="text-center mt-8 text-sm text-text-subtle">
                    <p>&copy; {new Date().getFullYear()} Sales Funnel Hero. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};


// The main App component that provides the form context.
const App: React.FC = () => {
    return (
        <FormProvider>
            <AppController />
        </FormProvider>
    );
};

export default App;