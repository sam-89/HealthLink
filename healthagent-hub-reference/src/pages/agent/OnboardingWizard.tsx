import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, ChevronRight, User, FileText, HelpCircle, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileUploader } from '@/components/shared/FileUploader';
import { DocumentRequirement } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const STEPS = [
  { id: 1, label: 'Profile', icon: User },
  { id: 2, label: 'Licenses', icon: FileText },
  { id: 3, label: 'Background', icon: HelpCircle },
  { id: 4, label: 'Documents', icon: Upload },
];

const STATES = ['Alabama', 'Alaska', 'Arizona', 'California', 'Colorado', 'Florida', 'Georgia', 'New York', 'Texas'];
const LINES_OF_AUTHORITY = ['Health', 'Life', 'Variable', 'Property', 'Casualty'];

const BACKGROUND_QUESTIONS = [
  { id: 'q1', question: 'Have you ever had an insurance license revoked, suspended, or denied?' },
  { id: 'q2', question: 'Have you ever been convicted of a felony?' },
  { id: 'q3', question: 'Have you ever been subject to disciplinary action by any regulatory body?' },
  { id: 'q4', question: 'Are you currently under investigation by any regulatory authority?' },
];

const REQUIRED_DOCUMENTS: DocumentRequirement[] = [
  { id: 'dl', name: "Driver's License", description: 'Valid government-issued photo ID', required: true, status: 'pending' },
  { id: 'eo', name: 'E&O Certificate', description: 'Errors & Omissions insurance certificate', required: true, status: 'pending' },
  { id: 'resume', name: 'Resume/CV', description: 'Your professional background', required: false, status: 'pending' },
  { id: 'cert', name: 'Training Certificates', description: 'Any relevant certifications', required: false, status: 'pending' },
];

// Validation schemas for each step
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(20, 'Phone number is too long'),
  npn: z.string().min(1, 'NPN is required').regex(/^\d+$/, 'NPN must contain only numbers'),
  ssn: z.string().length(4, 'Please enter the last 4 digits').regex(/^\d{4}$/, 'Must be 4 digits'),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'Please select a state'),
});

const licenseSchema = z.object({
  licensedState: z.string().min(1, 'Please select a state'),
  licenseNumber: z.string().min(1, 'License number is required'),
  expirationDate: z.string().min(1, 'Expiration date is required'),
  linesOfAuthority: z.array(z.string()).min(1, 'Select at least one line of authority'),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type LicenseFormData = z.infer<typeof licenseSchema>;

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [backgroundAnswers, setBackgroundAnswers] = useState<Record<string, { answer: boolean | null; explanation: string }>>({});
  const [documents, setDocuments] = useState<DocumentRequirement[]>(REQUIRED_DOCUMENTS);
  const [selectedLOAs, setSelectedLOAs] = useState<string[]>([]);

  // Form for Step 1: Profile
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      npn: '',
      ssn: '',
      street: '',
      city: '',
      state: '',
    },
  });

  // Form for Step 2: Licenses
  const licenseForm = useForm<LicenseFormData>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      licensedState: '',
      licenseNumber: '',
      expirationDate: '',
      linesOfAuthority: [],
    },
  });

  const handleNext = async () => {
    let isValid = true;

    if (currentStep === 1) {
      isValid = await profileForm.trigger();
    } else if (currentStep === 2) {
      licenseForm.setValue('linesOfAuthority', selectedLOAs);
      isValid = await licenseForm.trigger();
    }

    if (isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(Math.min(currentStep + 1, 4));
    }
  };

  const handleBack = () => setCurrentStep(Math.max(currentStep - 1, 1));

  const handleUpload = (docId: string, file: File) => {
    setDocuments(docs => docs.map(d => d.id === docId ? { ...d, file, status: 'uploaded' } : d));
  };

  const handleRemoveFile = (docId: string) => {
    setDocuments(docs => docs.map(d => d.id === docId ? { ...d, file: undefined, status: 'pending' } : d));
  };

  const toggleLOA = (loa: string) => {
    setSelectedLOAs(prev => 
      prev.includes(loa) ? prev.filter(l => l !== loa) : [...prev, loa]
    );
    // Clear the error when user selects
    if (!selectedLOAs.includes(loa)) {
      licenseForm.clearErrors('linesOfAuthority');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold">Agent Onboarding</h1>
        <p className="text-muted-foreground mt-1">Complete all steps to activate your account</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 px-4">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);
          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                  isActive && 'bg-primary text-primary-foreground',
                  isCompleted && !isActive && 'bg-success/10 text-success',
                  !isActive && !isCompleted && 'text-muted-foreground hover:bg-muted'
                )}
              >
                {isCompleted && !isActive ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                <span className="font-medium hidden sm:inline">{step.label}</span>
              </button>
              {index < STEPS.length - 1 && <ChevronRight className="w-5 h-5 text-muted-foreground mx-2" />}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].label}</CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Enter your personal information'}
            {currentStep === 2 && 'Add your state licenses and lines of authority'}
            {currentStep === 3 && 'Answer background disclosure questions'}
            {currentStep === 4 && 'Upload required documents'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Profile */}
          {currentStep === 1 && (
            <Form {...profileForm}>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Sarah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Johnson" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="sarah@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="npn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>National Producer Number (NPN)</FormLabel>
                      <FormControl>
                        <Input placeholder="12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="ssn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSN (Last 4)</FormLabel>
                      <FormControl>
                        <Input placeholder="••••" maxLength={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Los Angeles" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}

          {/* Step 2: Licenses */}
          {currentStep === 2 && (
            <Form {...licenseForm}>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={licenseForm.control}
                    name="licensedState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Licensed State</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={licenseForm.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="LIC-123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={licenseForm.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiration Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={licenseForm.control}
                  name="linesOfAuthority"
                  render={() => (
                    <FormItem>
                      <FormLabel>Lines of Authority</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {LINES_OF_AUTHORITY.map(loa => (
                          <Button
                            key={loa}
                            type="button"
                            variant={selectedLOAs.includes(loa) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => toggleLOA(loa)}
                          >
                            {loa}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}

          {/* Step 3: Background Questions */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {BACKGROUND_QUESTIONS.map((q) => (
                <div key={q.id} className="space-y-3">
                  <p className="font-medium">{q.question}</p>
                  <RadioGroup
                    value={backgroundAnswers[q.id]?.answer?.toString()}
                    onValueChange={(val) => setBackgroundAnswers(prev => ({ ...prev, [q.id]: { ...prev[q.id], answer: val === 'true' } }))}
                    className="flex gap-4"
                  >
                    <div className="flex items-center gap-2"><RadioGroupItem value="false" id={`${q.id}-no`} /><label htmlFor={`${q.id}-no`} className="text-sm">No</label></div>
                    <div className="flex items-center gap-2"><RadioGroupItem value="true" id={`${q.id}-yes`} /><label htmlFor={`${q.id}-yes`} className="text-sm">Yes</label></div>
                  </RadioGroup>
                  {backgroundAnswers[q.id]?.answer === true && (
                    <Textarea
                      placeholder="Please provide an explanation..."
                      value={backgroundAnswers[q.id]?.explanation || ''}
                      onChange={(e) => setBackgroundAnswers(prev => ({ ...prev, [q.id]: { ...prev[q.id], explanation: e.target.value } }))}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="space-y-4">
              {documents.map((doc) => (
                <FileUploader key={doc.id} requirement={doc} onUpload={(file) => handleUpload(doc.id, file)} onRemove={() => handleRemoveFile(doc.id)} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>Back</Button>
        <Button onClick={handleNext}>{currentStep === 4 ? 'Submit Application' : 'Continue'}</Button>
      </div>
    </div>
  );
}
