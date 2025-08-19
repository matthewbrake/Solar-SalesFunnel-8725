

import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { FormData, FormContextType } from '../types.ts';
import { ServiceType } from '../types.ts';

// Create a context with a default value.
const FormContext = createContext<FormContextType | undefined>(undefined);

// Initial state for the form data.
const initialFormData: FormData = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    companyName: '',
    address: null,
    service: null,
    creditScore: '',
    interestLevel: '',
    monthlyBill: 150,
    bills: [],
    appointmentSlot: null,
    solarData: null,
    projectNotes: '',
};

// Provider component that wraps the app and makes the form state available.
export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);

    // Function to proceed to the next step.
    const nextStep = () => {
        // If the current step is 1 and the service is not Solar, skip step 2 (Solar Analysis)
        if (step === 1 && formData.service !== ServiceType.Solar) {
            setStep(s => s + 2); 
        } else {
            setStep(s => s + 1);
        }
    };

    // Function to go back to the previous step.
    const prevStep = () => {
         // If we are on step 3 and the service is not Solar, we need to go back 2 steps to step 1.
        if (step === 3 && formData.service !== ServiceType.Solar) {
            setStep(s => s - 2);
        } else {
            setStep(s => s - 1);
        }
    };

    // Function to update form data.
    const updateFormData = (data: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const value = { step, setStep, formData, updateFormData, nextStep, prevStep };

    return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

// Custom hook to use the form context easily in components.
export const useFormContext = (): FormContextType => {
    const context = useContext(FormContext);
    if (context === undefined) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
};