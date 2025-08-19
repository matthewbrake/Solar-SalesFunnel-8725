

import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import Button from '../ui/Button';
import type { BillFile } from '../../types.ts';

// Simple calendar component
const Calendar: React.FC<{ onSelectDate: (date: Date) => void; selectedDate: Date | null }> = ({ onSelectDate, selectedDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const days = [];

    for (let i = 0; i < 42; i++) {
        days.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
    }
    
    const isToday = (date: Date) => new Date().toDateString() === date.toDateString();
    const isSelected = (date: Date) => selectedDate?.toDateString() === date.toDateString();
    const isInMonth = (date: Date) => date.getMonth() === currentMonth.getMonth();

    return (
        <div className="p-4 bg-background-surface border border-border rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>&lt;</button>
                <div className="font-bold text-lg text-text-primary">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-text-subtle">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 mt-2">
                {days.map(day => (
                    <button 
                        key={day.toISOString()}
                        onClick={() => onSelectDate(day)}
                        className={`p-2 rounded-full transition-colors ${!isInMonth(day) ? 'text-border' : 'text-text-secondary'} ${isToday(day) ? 'bg-primary-light text-primary' : ''} ${isSelected(day) ? 'bg-primary text-white' : 'hover:bg-secondary-light'}`}
                    >
                        {day.getDate()}
                    </button>
                ))}
            </div>
        </div>
    );
};


const Step4Scheduling: React.FC = () => {
    const { formData, updateFormData, nextStep, prevStep } = useFormContext();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedDate, setSelectedDate] = useState<Date | null>(formData.appointmentSlot);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newErrors: Record<string, string> = {};
        
        const newBills: BillFile[] = files.map(file => {
            // Validation: Size limit (e.g., 5MB)
            if (file.size > 5 * 1024 * 1024) {
                newErrors.bills = `${file.name} is too large. Maximum size is 5MB.`;
            }
            // Validation: File type
            if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
                newErrors.bills = `${file.name} has an invalid file type. Only PDF, JPG, PNG are allowed.`;
            }
            return { file, preview: URL.createObjectURL(file) };
        }).filter((_, index) => !newErrors.bills); // filter out files with errors

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        updateFormData({ bills: [...formData.bills, ...newBills].slice(0, 4) }); // Limit to 4 files
        setErrors({});
    };

    const removeFile = (index: number) => {
        const updatedBills = formData.bills.filter((_, i) => i !== index);
        updateFormData({ bills: updatedBills });
    };

    const timeSlots = Array.from({ length: 10 }, (_, i) => `${i + 8}:00`); // 8 AM to 5 PM (17:00)

    const handleTimeSelect = (time: string) => {
        if (selectedDate) {
            const [hour] = time.split(':');
            const newDate = new Date(selectedDate);
            newDate.setHours(parseInt(hour, 10), 0, 0, 0);
            updateFormData({ appointmentSlot: newDate });
        }
    };
    
    const validate = () => {
        const newErrors: Record<string, string> = {};
        // The prompt says only the last month is required. We'll check for at least one file.
        if (formData.bills.length === 0) {
            newErrors.bills = "Please upload at least one electricity bill.";
        }
        if (!formData.appointmentSlot) {
            newErrors.appointment = "Please select an appointment date and time.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            nextStep();
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold">Final Steps</h2>
                <p className="text-text-secondary mt-1">Upload your bills and schedule a consultation.</p>
            </div>

            {/* File Upload */}
            <div>
                <h3 className="text-lg font-semibold">Upload Your Last 4 Electric Bills</h3>
                <p className="text-sm text-text-secondary mb-3">Please provide at least one bill. (Max 5MB each, PDF/JPG/PNG)</p>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md bg-secondary-light/50">
                    <div className="space-y-1 text-center">
                        {/* Icon */}
                        <svg className="mx-auto h-12 w-12 text-text-subtle" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <div className="flex text-sm text-text-secondary">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                <span>Upload files</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                    </div>
                </div>
                {errors.bills && <p className="mt-2 text-sm text-danger">{errors.bills}</p>}
                {formData.bills.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {formData.bills.map((bill, index) => (
                            <div key={index} className="flex items-center justify-between bg-secondary-light p-2 rounded-md">
                                <span className="text-sm text-text-secondary truncate">{bill.file.name}</span>
                                <button onClick={() => removeFile(index)} className="text-danger hover:text-danger/80 text-sm font-bold">Remove</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Scheduling */}
            <div>
                 <h3 className="text-lg font-semibold">Schedule Your Consultation</h3>
                 {errors.appointment && <p className="mt-2 text-sm text-danger">{errors.appointment}</p>}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-3">
                    <Calendar onSelectDate={setSelectedDate} selectedDate={selectedDate} />
                    <div>
                        <h4 className="font-semibold text-center mb-2">{selectedDate ? selectedDate.toDateString() : "Select a date"}</h4>
                        {selectedDate && (
                            <div className="grid grid-cols-2 gap-2">
                                {timeSlots.map(time => (
                                    <button 
                                        key={time}
                                        onClick={() => handleTimeSelect(time)}
                                        className={`p-2 border rounded-md transition-colors text-sm ${formData.appointmentSlot?.getHours() === parseInt(time, 10) ? 'bg-primary text-white border-primary' : 'bg-background-surface border-border hover:bg-secondary-light'}`}
                                    >
                                        {time} - {parseInt(time,10)+1}:00
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                 </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button onClick={prevStep} variant="secondary">Back</Button>
                <Button onClick={handleNext}>Submit for Review</Button>
            </div>
        </div>
    );
};

export default Step4Scheduling;