
import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import Button from '../ui/Button';

const Step3Qualification: React.FC = () => {
    const { formData, updateFormData, nextStep, prevStep } = useFormContext();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const creditScores = [
        { label: 'Excellent', range: '720+' },
        { label: 'Good', range: '690-719' },
        { label: 'Fair', range: '630-689' },
    ];

    const interestLevels = ['Very Interested', 'Interested', 'Slightly Interested', 'Just Browsing'];

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.creditScore) newErrors.creditScore = 'Please select a credit score range.';
        if (!formData.interestLevel) newErrors.interestLevel = 'Please select your interest level.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleNext = () => {
        if(validate()) {
            nextStep();
        }
    };
    
    const handleSelect = (field: 'creditScore' | 'interestLevel', value: string) => {
        updateFormData({ [field]: value });
        setErrors(prev => ({...prev, [field]: ''}));
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-text-primary">A Few More Details</h2>
                <p className="text-text-secondary mt-1">This helps us tailor the best solution for you.</p>
            </div>

            {/* Credit Score Section */}
            <div>
                <h3 className="text-lg font-semibold text-text-primary">What is your estimated credit score?</h3>
                 {errors.creditScore && <p className="mt-1 text-sm text-danger">{errors.creditScore}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    {creditScores.map(({ label, range }) => (
                        <button
                            key={label}
                            onClick={() => handleSelect('creditScore', label as any)}
                            className={`p-4 border-2 rounded-lg text-center transition-all duration-200 
                                ${formData.creditScore === label ? 'border-primary bg-primary-light ring-2 ring-primary' : 'border-border bg-background-surface hover:border-primary'}`}
                        >
                            <p className="font-bold text-lg text-text-primary">{label}</p>
                            <p className="text-sm text-text-subtle">{range}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Interest Level Section */}
            <div>
                <h3 className="text-lg font-semibold text-text-primary">How interested are you?</h3>
                {errors.interestLevel && <p className="mt-1 text-sm text-danger">{errors.interestLevel}</p>}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    {interestLevels.map((level) => (
                        <button
                            key={level}
                            onClick={() => handleSelect('interestLevel', level as any)}
                            className={`p-4 border-2 rounded-lg text-center transition-all duration-200 
                                ${formData.interestLevel === level ? 'border-primary bg-primary-light ring-2 ring-primary' : 'border-border bg-background-surface hover:border-primary'}`}
                        >
                            <p className="font-semibold text-text-primary">{level}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Monthly Bill Slider */}
            <div>
                <label htmlFor="monthlyBill" className="text-lg font-semibold text-text-primary">
                    What is your average monthly electric bill?
                </label>
                <div className="flex items-center gap-4 mt-3">
                    <span className="text-lg font-bold text-primary w-24 text-center">${formData.monthlyBill}</span>
                    <input
                        id="monthlyBill"
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={formData.monthlyBill}
                        onChange={(e) => updateFormData({ monthlyBill: parseInt(e.target.value, 10) })}
                        className="w-full h-2 bg-secondary-light rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button onClick={prevStep} variant="secondary">Back</Button>
                <Button onClick={handleNext}>Next Step</Button>
            </div>
        </div>
    );
};

export default Step3Qualification;