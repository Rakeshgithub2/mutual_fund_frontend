'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Check,
  Upload,
  User,
  MapPin,
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import { getTranslation } from '@/lib/i18n';

const steps = [
  { id: 1, name: 'Personal Details', icon: User },
  { id: 2, name: 'Address & Bank', icon: MapPin },
  { id: 3, name: 'Upload Documents', icon: Upload },
  { id: 4, name: 'Review & Submit', icon: FileText },
];

export default function KYCPage() {
  const { language, mounted } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    panNumber: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    panFile: null as File | null,
    aadhaarFile: null as File | null,
    bankProofFile: null as File | null,
  });

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : `${BASE_URL}/api`
  ).replace(/\/+$/, '');

  const t = (key: string) => getTranslation(language, key);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Get token from localStorage
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setError('Please login to submit KYC');
        return;
      }

      // Prepare KYC data (excluding files for now - will add file upload later)
      const kycData = {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        panNumber: formData.panNumber,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        // TODO: Add file URLs after implementing file upload
      };

      const response = await fetch(`${API_URL}/kyc/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(kycData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please login again.');
          localStorage.removeItem('accessToken');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit KYC');
      }

      const data = await response.json();
      console.log('✅ KYC submitted:', data);

      // Show success screen
      setIsSubmitted(true);
    } catch (err) {
      console.error('KYC submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit KYC');
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mx-auto w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              KYC Submitted Successfully!
            </h1>
            <p className="text-lg text-muted mb-8">
              Your KYC application is under review. We'll notify you once it's
              approved.
            </p>
            <div className="bg-card border border-border rounded-lg p-6 text-left mb-8">
              <h3 className="font-semibold text-foreground mb-4">
                What happens next?
              </h3>
              <ul className="space-y-3 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span>
                    Your documents will be verified within 24-48 hours
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span>
                    You'll receive an email and SMS notification once approved
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span>
                    After approval, you can start investing immediately
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => (window.location.href = '/')}>
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = '/portfolio')}
              >
                View Portfolio
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Complete Your KYC
          </h1>
          <p className="text-muted">
            Required for investing in mutual funds as per SEBI regulations
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex-1 flex flex-col items-center relative"
              >
                <div className="flex items-center w-full">
                  {index > 0 && (
                    <div
                      className={`flex-1 h-1 ${
                        currentStep > index ? 'bg-primary' : 'bg-muted'
                      } transition-colors`}
                    />
                  )}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      currentStep > step.id
                        ? 'bg-primary border-primary text-white'
                        : currentStep === step.id
                          ? 'bg-primary border-primary text-white'
                          : 'bg-background border-muted text-muted'
                    } transition-all z-10`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 ${
                        currentStep > step.id ? 'bg-primary' : 'bg-muted'
                      } transition-colors`}
                    />
                  )}
                </div>
                <p
                  className={`text-xs mt-2 font-medium ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted'
                  }`}
                >
                  {step.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
            <CardDescription>
              Step {currentStep} of {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name (as per PAN)</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange('fullName', e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange('dateOfBirth', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      placeholder="ABCDE1234F"
                      value={formData.panNumber}
                      onChange={(e) =>
                        handleInputChange(
                          'panNumber',
                          e.target.value.toUpperCase()
                        )
                      }
                      maxLength={10}
                    />
                    <p className="text-xs text-muted">
                      Enter your 10-character PAN number
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange('phone', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Address & Bank */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="House No, Street, Area"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange('address', e.target.value)
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Mumbai"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange('city', e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="Maharashtra"
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange('state', e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        placeholder="400001"
                        value={formData.pincode}
                        onChange={(e) =>
                          handleInputChange('pincode', e.target.value)
                        }
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Bank Account Details
                    </h3>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          placeholder="HDFC Bank"
                          value={formData.bankName}
                          onChange={(e) =>
                            handleInputChange('bankName', e.target.value)
                          }
                        />
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            type="number"
                            placeholder="1234567890"
                            value={formData.accountNumber}
                            onChange={(e) =>
                              handleInputChange('accountNumber', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ifscCode">IFSC Code</Label>
                          <Input
                            id="ifscCode"
                            placeholder="HDFC0001234"
                            value={formData.ifscCode}
                            onChange={(e) =>
                              handleInputChange(
                                'ifscCode',
                                e.target.value.toUpperCase()
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Upload Documents */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <div className="flex gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          Document Requirements
                        </p>
                        <ul className="text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Upload clear, readable scans or photos</li>
                          <li>
                            • Accepted formats: JPG, PNG, PDF (max 5MB each)
                          </li>
                          <li>• All documents must be valid and not expired</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {[
                    { field: 'panFile', label: 'PAN Card', required: true },
                    {
                      field: 'aadhaarFile',
                      label: 'Aadhaar Card',
                      required: true,
                    },
                    {
                      field: 'bankProofFile',
                      label: 'Bank Proof (Cancelled Cheque/Statement)',
                      required: true,
                    },
                  ].map((doc) => (
                    <div key={doc.field} className="space-y-2">
                      <Label htmlFor={doc.field}>
                        {doc.label}{' '}
                        {doc.required && <span className="text-danger">*</span>}
                      </Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors">
                        <div className="flex flex-col items-center text-center">
                          <Upload className="w-10 h-10 text-muted mb-3" />
                          <p className="text-sm text-foreground mb-2">
                            {(formData as any)[doc.field]
                              ? (formData as any)[doc.field].name
                              : 'Click to upload or drag and drop'}
                          </p>
                          <p className="text-xs text-muted">
                            JPG, PNG, or PDF (max 5MB)
                          </p>
                          <input
                            id={doc.field}
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) =>
                              handleFileUpload(
                                doc.field,
                                e.target.files?.[0] || null
                              )
                            }
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() =>
                              document.getElementById(doc.field)?.click()
                            }
                          >
                            Choose File
                          </Button>
                        </div>
                      </div>
                      {(formData as any)[doc.field] && (
                        <div className="flex items-center gap-2 text-sm text-success">
                          <Check className="w-4 h-4" />
                          File uploaded successfully
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                    <p className="text-sm text-foreground">
                      <strong>Important:</strong> Please review all information
                      carefully before submitting. Incorrect information may
                      delay your KYC approval.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">
                        Personal Details
                      </h3>
                      <div className="grid gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted">Full Name:</span>
                          <span className="font-medium text-foreground">
                            {formData.fullName || 'Not provided'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Date of Birth:</span>
                          <span className="font-medium text-foreground">
                            {formData.dateOfBirth || 'Not provided'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">PAN Number:</span>
                          <span className="font-medium text-foreground">
                            {formData.panNumber || 'Not provided'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Email:</span>
                          <span className="font-medium text-foreground">
                            {formData.email || 'Not provided'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h3 className="font-semibold text-foreground mb-3">
                        Address & Bank
                      </h3>
                      <div className="grid gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted">Address:</span>
                          <span className="font-medium text-foreground text-right max-w-xs">
                            {formData.address || 'Not provided'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Bank:</span>
                          <span className="font-medium text-foreground">
                            {formData.bankName || 'Not provided'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Account Number:</span>
                          <span className="font-medium text-foreground">
                            {formData.accountNumber || 'Not provided'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h3 className="font-semibold text-foreground mb-3">
                        Documents Uploaded
                      </h3>
                      <div className="grid gap-2 text-sm">
                        {[
                          { field: 'panFile', label: 'PAN Card' },
                          { field: 'aadhaarFile', label: 'Aadhaar Card' },
                          { field: 'bankProofFile', label: 'Bank Proof' },
                        ].map((doc) => (
                          <div
                            key={doc.field}
                            className="flex items-center gap-2"
                          >
                            {(formData as any)[doc.field] ? (
                              <>
                                <Check className="w-4 h-4 text-success" />
                                <span className="text-foreground">
                                  {doc.label}
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-danger" />
                                <span className="text-danger">
                                  {doc.label} - Not uploaded
                                </span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="mt-1" required />
                      <span className="text-sm text-muted">
                        I hereby declare that the information provided is true
                        and accurate to the best of my knowledge. I understand
                        that providing false information may result in legal
                        action.
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-border">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  className="ml-auto flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="ml-auto flex items-center gap-2"
                >
                  {submitting ? 'Submitting...' : 'Submit KYC'}
                  <Check className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
