'use client';

import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import Step1Company from './Step1Company';
import Step2Venue from './Step2Venue';
import Step3AssignDJs from './Step3AssignDJs';
import Step4Schedule from './Step4Schedule';
import Step5Credentials from './Step5Credentials';

export interface CompanyData {
  companyName: string;
  contactPerson: string;
  position: string;
  email: string;
  phone: string;
}

export interface VenueSlot {
  name: string;
  startTime: string;
  endTime: string;
}

export interface VenueData {
  venueName: string;
  venueType: string;
  startTime: string;
  endTime: string;
  hasMultipleSlots: boolean;
  slots: VenueSlot[];
}

export interface DJAssignment {
  djId: string;
  djName: string;
}

export interface ScheduleEntry {
  dayOfWeek: number;
  slotIndex: number;
  djId: string | null;
}

export interface CredentialsData {
  email: string;
  password: string;
  sendWelcomeEmail: boolean;
}

export interface OnboardingData {
  company: CompanyData;
  venue: VenueData;
  assignedDJs: DJAssignment[];
  schedule: ScheduleEntry[];
  credentials: CredentialsData;
}

const STEPS = [
  { id: 1, name: 'Company', description: 'Company information' },
  { id: 2, name: 'Venue', description: 'Venue details' },
  { id: 3, name: 'DJs', description: 'Assign DJs' },
  { id: 4, name: 'Schedule', description: 'Initial schedule' },
  { id: 5, name: 'Credentials', description: 'Generate credentials' },
];

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => Promise<void>;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<OnboardingData>({
    company: {
      companyName: '',
      contactPerson: '',
      position: '',
      email: '',
      phone: '',
    },
    venue: {
      venueName: '',
      venueType: 'restaurant',
      startTime: '18:00',
      endTime: '02:00',
      hasMultipleSlots: false,
      slots: [],
    },
    assignedDJs: [],
    schedule: [],
    credentials: {
      email: '',
      password: '',
      sendWelcomeEmail: true,
    },
  });

  const updateCompany = (company: CompanyData) => {
    setData((prev) => ({
      ...prev,
      company,
      credentials: {
        ...prev.credentials,
        email: company.email,
      },
    }));
  };

  const updateVenue = (venue: VenueData) => {
    setData((prev) => ({ ...prev, venue }));
  };

  const updateAssignedDJs = (assignedDJs: DJAssignment[]) => {
    setData((prev) => ({ ...prev, assignedDJs }));
  };

  const updateSchedule = (schedule: ScheduleEntry[]) => {
    setData((prev) => ({ ...prev, schedule }));
  };

  const updateCredentials = (credentials: CredentialsData) => {
    setData((prev) => ({ ...prev, credentials }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await onComplete(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create venue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {STEPS.map((step, stepIdx) => (
            <li
              key={step.id}
              className={`${stepIdx !== STEPS.length - 1 ? 'flex-1' : ''} relative`}
            >
              <div className="flex items-center">
                <div
                  className={`
                    relative z-10 flex h-10 w-10 items-center justify-center rounded-full
                    ${
                      step.id < currentStep
                        ? 'bg-brand-cyan'
                        : step.id === currentStep
                        ? 'border-2 border-brand-cyan bg-deep-teal'
                        : 'border-2 border-white/20 bg-white/5'
                    }
                  `}
                >
                  {step.id < currentStep ? (
                    <CheckIcon className="h-5 w-5 text-white" />
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        step.id === currentStep ? 'text-brand-cyan' : 'text-gray-500'
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                </div>

                {stepIdx !== STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      step.id < currentStep ? 'bg-brand-cyan' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>

              <div className="mt-2 hidden md:block">
                <span
                  className={`text-sm font-medium ${
                    step.id <= currentStep ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        {currentStep === 1 && (
          <Step1Company
            data={data.company}
            onChange={updateCompany}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <Step2Venue
            data={data.venue}
            onChange={updateVenue}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <Step3AssignDJs
            selectedDJs={data.assignedDJs}
            onChange={updateAssignedDJs}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && (
          <Step4Schedule
            venue={data.venue}
            assignedDJs={data.assignedDJs}
            schedule={data.schedule}
            onChange={updateSchedule}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 5 && (
          <Step5Credentials
            data={data.credentials}
            companyEmail={data.company.email}
            onChange={updateCredentials}
            onComplete={handleComplete}
            onBack={handleBack}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}
