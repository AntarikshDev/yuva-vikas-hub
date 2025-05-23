
import React, { useState } from 'react';
import { MobileAppLayout } from '@/layouts/MobileAppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';

const NewCandidate: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // Mock step data for demonstration
  // In a real app, this would be managed with react-hook-form
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: '',
    gender: '',
    dob: '',
    mobileNumber: '',
    alternateNumber: '',
    aadhaarNumber: '',
    
    // Step 2: Address & Background
    state: '',
    district: '',
    village: '',
    education: '',
    familyIncome: '',
    socialCategory: '',
    religion: '',
    fatherName: '',
    motherName: '',
    
    // Step 3: Job Interest
    preferredJobRole: '',
    preferredLocation: '',
    willingToRelocate: '',
    jobType: '',
    
    // Step 4: Documents
    photo: null,
    aadhaarCard: null,
    bankPassbook: null,
    certificate: null,
    
    // Step 5: Consent
    signature: null,
    parentMobile: '',
  });
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const calculateProgress = () => {
    return (currentStep / totalSteps) * 100;
  };
  
  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // In a real app, this would send the data to a server
    alert('Candidate registered successfully!');
  };
  
  // Mock options for dropdowns
  const stateOptions = ['Maharashtra', 'Karnataka', 'Gujarat', 'Rajasthan'];
  const genderOptions = ['Male', 'Female', 'Other'];
  const educationOptions = ['Below 10th', '10th Pass', '12th Pass', 'Graduate', 'Post Graduate'];
  const incomeOptions = ['Below 1L', '1L-3L', '3L-5L', 'Above 5L'];
  const socialCategoryOptions = ['General', 'SC', 'ST', 'OBC'];
  const religionOptions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'];
  const jobRoleOptions = ['Healthcare', 'Retail', 'Hospitality', 'IT Support', 'BPO'];
  const jobTypeOptions = ['Full-Time', 'Part-Time', 'Contract'];
  const yesNoOptions = ['Yes', 'No'];
  
  return (
    <MobileAppLayout role="mobilizer" title="Register New Candidate">
      <div className="space-y-4 pb-16">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium">Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(calculateProgress())}% Complete</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div 
              className="h-full bg-primary-500 transition-all duration-300" 
              style={{ width: `${calculateProgress()}%` }} 
            />
          </div>
        </div>
        
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="rounded-lg border bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input 
                  id="fullName"
                  placeholder="Enter candidate's full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  className="h-10 w-full rounded-md border border-neutral-200 px-3 py-2"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <option value="">Select Gender</option>
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input 
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="mobileNumber">Mobile Number *</Label>
                <Input 
                  id="mobileNumber"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  maxLength={10}
                />
              </div>
              
              <div>
                <Label htmlFor="alternateNumber">Alternate Number (Optional)</Label>
                <Input 
                  id="alternateNumber"
                  type="tel"
                  placeholder="Alternate contact number"
                  value={formData.alternateNumber}
                  onChange={(e) => handleInputChange('alternateNumber', e.target.value)}
                  maxLength={10}
                />
              </div>
              
              <div>
                <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                <Input 
                  id="aadhaarNumber"
                  placeholder="12-digit Aadhaar number"
                  value={formData.aadhaarNumber}
                  onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                  maxLength={12}
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Please verify the number carefully
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Address & Background */}
        {currentStep === 2 && (
          <div className="rounded-lg border bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold">Address & Background</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="state">State *</Label>
                <select
                  id="state"
                  className="h-10 w-full rounded-md border border-neutral-200 px-3 py-2"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                >
                  <option value="">Select State</option>
                  {stateOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="district">District *</Label>
                <Input 
                  id="district"
                  placeholder="Enter district"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="village">Village/Town/City *</Label>
                <Input 
                  id="village"
                  placeholder="Enter village/town/city"
                  value={formData.village}
                  onChange={(e) => handleInputChange('village', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="education">Education Level *</Label>
                <select
                  id="education"
                  className="h-10 w-full rounded-md border border-neutral-200 px-3 py-2"
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                >
                  <option value="">Select Education</option>
                  {educationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="familyIncome">Family Income (Annual) *</Label>
                <select
                  id="familyIncome"
                  className="h-10 w-full rounded-md border border-neutral-200 px-3 py-2"
                  value={formData.familyIncome}
                  onChange={(e) => handleInputChange('familyIncome', e.target.value)}
                >
                  <option value="">Select Income Range</option>
                  {incomeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="socialCategory">Social Category *</Label>
                <select
                  id="socialCategory"
                  className="h-10 w-full rounded-md border border-neutral-200 px-3 py-2"
                  value={formData.socialCategory}
                  onChange={(e) => handleInputChange('socialCategory', e.target.value)}
                >
                  <option value="">Select Category</option>
                  {socialCategoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="religion">Religion *</Label>
                <select
                  id="religion"
                  className="h-10 w-full rounded-md border border-neutral-200 px-3 py-2"
                  value={formData.religion}
                  onChange={(e) => handleInputChange('religion', e.target.value)}
                >
                  <option value="">Select Religion</option>
                  {religionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="fatherName">Father's Name *</Label>
                <Input 
                  id="fatherName"
                  placeholder="Enter father's name"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="motherName">Mother's Name *</Label>
                <Input 
                  id="motherName"
                  placeholder="Enter mother's name"
                  value={formData.motherName}
                  onChange={(e) => handleInputChange('motherName', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Job Interest */}
        {currentStep === 3 && (
          <div className="rounded-lg border bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold">Job Interest & Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="preferredJobRole">Preferred Job Role *</Label>
                <select
                  id="preferredJobRole"
                  className="h-10 w-full rounded-md border border-neutral-200 px-3 py-2"
                  value={formData.preferredJobRole}
                  onChange={(e) => handleInputChange('preferredJobRole', e.target.value)}
                >
                  <option value="">Select Job Role</option>
                  {jobRoleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="preferredLocation">Preferred Location *</Label>
                <Input 
                  id="preferredLocation"
                  placeholder="Enter preferred work location"
                  value={formData.preferredLocation}
                  onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="willingToRelocate">Ready to Relocate? *</Label>
                <select
                  id="willingToRelocate"
                  className="h-10 w-full rounded-md border border-neutral-200 px-3 py-2"
                  value={formData.willingToRelocate}
                  onChange={(e) => handleInputChange('willingToRelocate', e.target.value)}
                >
                  <option value="">Select Option</option>
                  {yesNoOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="jobType">Job Type *</Label>
                <select
                  id="jobType"
                  className="h-10 w-full rounded-md border border-neutral-200 px-3 py-2"
                  value={formData.jobType}
                  onChange={(e) => handleInputChange('jobType', e.target.value)}
                >
                  <option value="">Select Job Type</option>
                  {jobTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Document Upload */}
        {currentStep === 4 && (
          <div className="rounded-lg border bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold">Document Upload</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="photo">Photo *</Label>
                <div className="mt-1 flex items-center justify-center rounded-md border-2 border-dashed border-neutral-300 p-6">
                  <div className="space-y-1 text-center">
                    <div className="mx-auto flex justify-center text-4xl">
                      📷
                    </div>
                    <div className="text-sm text-neutral-600">
                      Take a photo or upload from gallery
                    </div>
                    <div className="pt-2">
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleInputChange('photo', e.target.files?.[0])}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('photo')?.click()}
                      >
                        Choose Image
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="aadhaarCard">Aadhaar Card *</Label>
                <div className="mt-1 flex items-center justify-center rounded-md border-2 border-dashed border-neutral-300 p-6">
                  <div className="space-y-1 text-center">
                    <div className="mx-auto flex justify-center text-4xl">
                      🆔
                    </div>
                    <div className="text-sm text-neutral-600">
                      Capture clear image of Aadhaar
                    </div>
                    <div className="pt-2">
                      <input
                        id="aadhaarCard"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleInputChange('aadhaarCard', e.target.files?.[0])}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('aadhaarCard')?.click()}
                      >
                        Upload Document
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="bankPassbook">Bank Passbook *</Label>
                <div className="mt-1 flex items-center justify-center rounded-md border-2 border-dashed border-neutral-300 p-6">
                  <div className="space-y-1 text-center">
                    <div className="mx-auto flex justify-center text-4xl">
                      💳
                    </div>
                    <div className="text-sm text-neutral-600">
                      First page with name and account details
                    </div>
                    <div className="pt-2">
                      <input
                        id="bankPassbook"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleInputChange('bankPassbook', e.target.files?.[0])}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('bankPassbook')?.click()}
                      >
                        Upload Document
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="certificate">Certificate (Optional)</Label>
                <div className="mt-1 flex items-center justify-center rounded-md border-2 border-dashed border-neutral-300 p-6">
                  <div className="space-y-1 text-center">
                    <div className="mx-auto flex justify-center text-4xl">
                      🎓
                    </div>
                    <div className="text-sm text-neutral-600">
                      Upload education or skill certificates
                    </div>
                    <div className="pt-2">
                      <input
                        id="certificate"
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => handleInputChange('certificate', e.target.files?.[0])}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('certificate')?.click()}
                      >
                        Upload Document
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 5: Final Consent */}
        {currentStep === 5 && (
          <div className="rounded-lg border bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold">Final Consent</h2>
            
            <div className="space-y-4">
              <div className="rounded-md bg-neutral-50 p-3">
                <p className="text-sm">
                  By submitting this form, the candidate agrees to:
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                  <li>Participate in the skill development program</li>
                  <li>Share personal information for training & placement</li>
                  <li>Attend all required sessions and assessments</li>
                  <li>Provide accurate information in the application</li>
                </ul>
              </div>
              
              <div>
                <Label htmlFor="signature">Digital Signature *</Label>
                <div className="mt-1 h-32 rounded-md border-2 border-dashed border-neutral-300">
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-neutral-500">
                      Candidate should sign here
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Clear Signature
                </Button>
              </div>
              
              <div>
                <Label htmlFor="parentMobile">Parent Mobile Number (Optional)</Label>
                <Input 
                  id="parentMobile"
                  type="tel"
                  placeholder="Parent/Guardian contact number"
                  value={formData.parentMobile}
                  onChange={(e) => handleInputChange('parentMobile', e.target.value)}
                  maxLength={10}
                />
                <p className="mt-1 text-xs text-neutral-500">
                  For parental consent and follow-ups
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="fixed bottom-16 left-0 right-0 flex justify-between bg-white p-4 shadow-md">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          
          {currentStep < totalSteps ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit}>
              Submit & Generate ID
            </Button>
          )}
        </div>
      </div>
    </MobileAppLayout>
  );
};

export default NewCandidate;
