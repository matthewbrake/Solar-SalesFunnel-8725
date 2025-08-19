
import React from 'react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    const percentage = Math.max(0, Math.min(100, (currentStep / totalSteps) * 100));

    return (
        <div className="mb-8">
            <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-primary">Progress</span>
                <span className="text-sm font-medium text-text-primary">{currentStep} of {totalSteps}</span>
            </div>
            <div className="w-full bg-secondary-light rounded-full h-2.5">
                <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
