
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFormContext } from '../../context/FormContext';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import type { Address, ServiceType as ServiceEnumType } from '../../types';
import { ServiceType } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';

// SVG icons for service buttons
const SolarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 001.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>;
const HvacIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>;
const RoofingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const SmartHomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h2.114a4 4 0 002.789-.952l.05-.025a2 2 0 001.106-1.79v-5.43a2 2 0 00-1.106-1.79l-.05-.025a4 4 0 00-2.789-.952H8.943a4 4 0 00-2.789.952l-.05.025a2 2 0 00-1.106 1.79zM18 10.5a1.5 1.5 0 11-3 0v6a1.5 1.5 0 013 0v-6z" /></svg>;


const Step1ContactInfo: React.FC = () => {
    const { formData, updateFormData, nextStep } = useFormContext();
    const { isLoaded, error: mapsError } = useGoogleMaps();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'phone') {
            updateFormData({ phone: formatPhoneNumber(value) });
        } else {
            updateFormData({ [id]: value });
        }
    };

    const formatPhoneNumber = (value: string) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        }
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    };

    const handlePlaceChanged = useCallback(() => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry && place.formatted_address) {
                const newAddress: Address = {
                    fullAddress: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                };
                updateFormData({ address: newAddress });
                 // Manually update input value if needed, though Autocomplete often does this.
                if(inputRef.current) {
                    inputRef.current.value = place.formatted_address;
                }
                setErrors(prev => ({ ...prev, address: '' }));
            }
        }
    }, [updateFormData]);


    useEffect(() => {
        if (isLoaded && inputRef.current && !autocompleteRef.current) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ['address'],
                componentRestrictions: { country: 'us' }, // Example: restrict to US
            });
            autocompleteRef.current.addListener('place_changed', handlePlaceChanged);
        }
    }, [isLoaded, handlePlaceChanged]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required.';
        if (!formData.lastName) newErrors.lastName = 'Last name is required.';
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
        }
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required.';
        } else if (formData.phone.replace(/[^\d]/g, '').length !== 10) {
            newErrors.phone = 'Phone number must be 10 digits.';
        }
        if (!formData.address) newErrors.address = 'Please select a valid address from the dropdown.';
        if (!formData.service) newErrors.service = 'Please select a service.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            nextStep();
        }
    };

    const handleServiceSelect = (service: ServiceEnumType) => {
        updateFormData({ service });
        setErrors(prev => ({ ...prev, service: '' }));
    };

    const services = [
        { name: ServiceType.Solar, icon: <SolarIcon /> },
        { name: ServiceType.HVAC, icon: <HvacIcon /> },
        { name: ServiceType.Roofing, icon: <RoofingIcon /> },
        { name: ServiceType.SmartHome, icon: <SmartHomeIcon /> },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-text-primary">Your Information</h2>
                <p className="text-text-secondary mt-1">Please provide your contact details to get started.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input id="firstName" label="First Name" value={formData.firstName} onChange={handleChange} error={errors.firstName} autoComplete="given-name" placeholder="John" />
                <Input id="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} error={errors.lastName} autoComplete="family-name" placeholder="Doe" />
                <Input id="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} error={errors.email} autoComplete="email" placeholder="john.doe@example.com" />
                <Input id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} autoComplete="tel" placeholder="(555) 555-5555" />
                <Input id="companyName" label="Company Name (Optional)" value={formData.companyName} onChange={handleChange} autoComplete="organization" placeholder="Acme Inc." />
                <div>
                    <Input id="address" ref={inputRef} label="Project Address" type="text" error={errors.address} disabled={!isLoaded || !!mapsError} placeholder={isLoaded ? "Start typing your address..." : "Loading address..."} autoComplete="street-address"/>
                    {mapsError && <p className="mt-2 text-sm text-danger font-semibold">{mapsError.message}</p>}
                </div>
            </div>
            
            <div>
                <h3 className="text-xl font-bold text-text-primary">What service are you interested in?</h3>
                {errors.service && <p className="mt-2 text-sm text-danger">{errors.service}</p>}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {services.map(({ name, icon }) => (
                        <button
                            key={name}
                            onClick={() => handleServiceSelect(name)}
                            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg text-center transition-all duration-200 group
                                ${formData.service === name 
                                    ? 'border-primary bg-primary-light ring-2 ring-primary' 
                                    : 'border-border bg-background-surface hover:border-primary hover:bg-primary-light'
                                }`}
                        >
                            <div className={`transition-colors duration-200 ${formData.service === name ? 'text-primary' : 'text-text-subtle group-hover:text-primary'}`}>
                                {icon}
                            </div>
                            <span className="font-semibold text-text-primary">{name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleNext}>Next Step</Button>
            </div>
        </div>
    );
};

export default Step1ContactInfo;