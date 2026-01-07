import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Info, Eye, EyeOff, Check, ChevronRight, X } from "lucide-react";
import IndividualDetailsForm, { IndividualDetailsData } from "@/components/license/IndividualDetailsForm";
import EmploymentHistoryForm, { EmploymentHistoryData, createEmptyEmployment, createEmptyAffiliation } from "@/components/license/EmploymentHistoryForm";
import BackgroundQuestionsForm, { BackgroundQuestionsData, createEmptyBackgroundData } from "@/components/license/BackgroundQuestionsForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATES_ELECTRONIC = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "District of Columbia", "Florida", "Georgia", "Guam", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
  "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas",
  "U.S. Virgin Islands", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

// License types available per state (sample data - can be expanded)
const STATE_LICENSE_TYPES: Record<string, string[]> = {
  "Alabama": ["Adjuster", "Insurance Producer", "Portable Electronics Ins Large", "Portable Electronics Ins Small", "Surplus Line Broker", "Temporary Producer"],
  "Alaska": ["Insurance Producer", "Surplus Line Broker", "Managing General Agent"],
  "Arizona": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster", "Bail Bond Agent"],
  "Arkansas": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "California": ["Life-Only Agent", "Accident & Health Agent", "Fire & Casualty Broker-Agent", "Surplus Line Broker", "Personal Lines Broker-Agent"],
  "Colorado": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "Connecticut": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster", "Reinsurance Intermediary"],
  "Delaware": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "District of Columbia": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "Florida": ["Life Agent", "Health Agent", "General Lines Agent", "Surplus Lines Agent", "Public Adjuster", "Title Agent"],
  "Georgia": ["Insurance Producer", "Surplus Line Broker", "Adjuster", "Counselor"],
  "Guam": ["Insurance Producer", "Surplus Line Broker"],
  "Hawaii": ["Insurance Producer", "Surplus Line Broker", "Independent Adjuster"],
  "Idaho": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "Illinois": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster", "Limited Lines Producer"],
  "Indiana": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "Iowa": ["Insurance Producer", "Surplus Line Broker", "Consultant"],
  "Kansas": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "Kentucky": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster", "Adjuster"],
  "Louisiana": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "Maine": ["Insurance Producer", "Surplus Line Broker", "Adjuster", "Consultant"],
  "Maryland": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "Massachusetts": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "Michigan": ["Insurance Producer", "Surplus Line Broker", "Adjuster", "Counselor"],
  "Minnesota": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "Mississippi": ["Insurance Producer", "Surplus Line Broker", "Adjuster"],
  "Missouri": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "Montana": ["Insurance Producer", "Surplus Line Broker", "Adjuster"],
  "Nebraska": ["Insurance Producer", "Surplus Line Broker", "Consultant"],
  "Nevada": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster", "Managing General Agent"],
  "New Hampshire": ["Insurance Producer", "Surplus Line Broker", "Adjuster"],
  "New Jersey": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "New Mexico": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "New York": ["Life Agent", "Accident & Health Agent", "Property & Casualty Broker", "Excess Line Broker", "Public Adjuster"],
  "North Carolina": ["Insurance Producer", "Surplus Line Broker", "Adjuster"],
  "North Dakota": ["Insurance Producer", "Surplus Line Broker", "Consultant"],
  "Ohio": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "Oklahoma": ["Insurance Producer", "Surplus Line Broker", "Adjuster"],
  "Oregon": ["Insurance Producer", "Surplus Line Broker", "Adjuster", "Consultant"],
  "Pennsylvania": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "Puerto Rico": ["Insurance Producer", "Surplus Line Broker"],
  "Rhode Island": ["Insurance Producer", "Surplus Line Broker", "Adjuster"],
  "South Carolina": ["Insurance Producer", "Surplus Line Broker", "Adjuster"],
  "South Dakota": ["Insurance Producer", "Surplus Line Broker"],
  "Tennessee": ["Insurance Producer", "Surplus Line Broker", "Adjuster"],
  "Texas": ["Life Agent", "Health Agent", "General Lines Agent", "Surplus Lines Agent", "Public Adjuster"],
  "U.S. Virgin Islands": ["Insurance Producer", "Surplus Line Broker"],
  "Utah": ["Insurance Producer", "Surplus Line Broker", "Adjuster", "Consultant"],
  "Vermont": ["Insurance Producer", "Surplus Line Broker", "Adjuster"],
  "Virginia": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
  "Washington": ["Insurance Producer", "Surplus Line Broker", "Adjuster"],
  "West Virginia": ["Insurance Producer", "Surplus Line Broker", "Adjuster"],
  "Wisconsin": ["Insurance Intermediary", "Surplus Line Broker", "Adjuster"],
  "Wyoming": ["Insurance Producer", "Surplus Line Broker", "Adjuster"],
};

const LICENSE_TYPES = [
  { id: "producer", name: "Producer", description: "Sell insurance products to consumers" },
  { id: "consultant", name: "Consultant", description: "Provide insurance advice without selling" },
  { id: "surplus-lines", name: "Surplus Lines Broker", description: "Handle specialty and high-risk insurance" },
];

const LINES_OF_AUTHORITY = [
  { id: "life", name: "Life" },
  { id: "accident-health", name: "Accident & Health/Sickness" },
  { id: "property", name: "Property" },
  { id: "casualty", name: "Casualty" },
  { id: "variable", name: "Variable Life/Variable Annuity" },
  { id: "personal-lines", name: "Personal Lines" },
];

const NewInsuranceLicensePage = () => {
  console.log("NewInsuranceLicensePage rendering");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const residency = searchParams.get("residency") || "resident";
  const entity = searchParams.get("entity") || "individual";
  
  console.log("Params:", { residency, entity });
  
  // Step management - Non-resident starts at step 0 for resident state selection
  const [currentStep, setCurrentStep] = useState(residency === "non-resident" ? 0 : 1);
  
  // Step 0 fields - Non-resident resident state selection
  const [residentState, setResidentState] = useState("");
  const [showNoResidentLicensePopup, setShowNoResidentLicensePopup] = useState(false);
  
  // Step 1 fields - Individual
  const [lastName, setLastName] = useState("");
  const [ssn, setSsn] = useState("");
  const [confirmSsn, setConfirmSsn] = useState("");
  const [showSsn, setShowSsn] = useState(false);
  const [showConfirmSsn, setShowConfirmSsn] = useState(false);
  const [residentLicenseNumber, setResidentLicenseNumber] = useState("");
  
  // Step 1 fields - Firm
  const [firmName, setFirmName] = useState("");
  const [ein, setEin] = useState("");
  const [agencyType, setAgencyType] = useState("");
  
  const [preparer, setPreparer] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [viewingState, setViewingState] = useState<string | null>(null);

  // Non-resident state selection
  const [stateFilter, setStateFilter] = useState<"electronic" | "all">("electronic");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  // Paper application only states (sample - can be expanded)
  const PAPER_ONLY_STATES = ["Mississippi", "Louisiana", "Maine"];
  const filteredStates = stateFilter === "electronic" 
    ? STATES_ELECTRONIC.filter(s => !PAPER_ONLY_STATES.includes(s))
    : STATES_ELECTRONIC;

  // Step 1.5 fields (License Information for Resident Individual)
  const [licenseType, setLicenseType] = useState("");
  const [previouslyLicensed, setPreviouslyLicensed] = useState<"yes" | "no" | "">("");

  // Step 1.75 fields (Qualification Information for Resident Individual)
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>([]);

  // Step 2 fields (Individual Details for Resident Individual)
  const emptyAddress = {
    lineOne: "",
    lineTwo: "",
    lineThree: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States"
  };
  
  const [individualDetails, setIndividualDetails] = useState<IndividualDetailsData>({
    ssn: "",
    npn: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    birthDate: "",
    gender: "",
    citizenCountryCode: "United States",
    businessEmail: "",
    applicantEmail: "",
    businessWebsite: "",
    finraCrdIdentifier: "",
    aliases: [],
    residenceAddress: { ...emptyAddress },
    businessAddress: { ...emptyAddress },
    mailingAddress: { ...emptyAddress },
    residencePhone: "",
    businessPhone: "",
    businessPhoneExt: "",
    faxNumber: ""
  });

  // Qualification codes per license type (sample data)
  const QUALIFICATION_CODES: Record<string, string[]> = {
    "Insurance Producer": ["Car Rental", "Credit", "Crop", "Legal Services", "Motor Club", "Self-Service Storage Facility", "Travel", "Variable Life/Variable Annuity"],
    "Adjuster": ["All Lines", "Property", "Casualty", "Workers Compensation"],
    "Surplus Line Broker": ["Property", "Casualty", "Marine", "Aviation"],
    "Public Adjuster": ["Property", "Casualty", "Commercial", "Residential"],
    "Life Agent": ["Life", "Variable Life", "Annuity", "Variable Annuity"],
    "Health Agent": ["Health", "Disability", "Long-Term Care", "Medicare Supplement"],
    "General Lines Agent": ["Property", "Casualty", "Auto", "Homeowners"],
  };

  // Step 2.25 fields (Employment History for Resident Individual)
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistoryData>({
    employmentEntries: [
      createEmptyEmployment(),
      createEmptyEmployment(),
      createEmptyEmployment(),
      createEmptyEmployment()
    ],
    affiliationEntries: [
      createEmptyAffiliation(),
      createEmptyAffiliation(),
      createEmptyAffiliation()
    ]
  });

  // Step 2.375 fields (Background Questions for Resident Individual)
  const [backgroundQuestions, setBackgroundQuestions] = useState<BackgroundQuestionsData>(createEmptyBackgroundData());

  // Step 2.5 fields (License Type & Lines of Authority - was Step 2)
  const [selectedLicenseType, setSelectedLicenseType] = useState("");
  const [selectedLines, setSelectedLines] = useState<string[]>([]);

  const isStep1Valid = entity === "firm" 
    ? residency === "non-resident"
      ? (firmName.trim() !== "" && ein.trim() !== "" && residentState !== "" && residentLicenseNumber.trim() !== "" && agencyType !== "" && preparer !== "" && selectedStates.length > 0)
      : (firmName.trim() !== "" && ein.trim() !== "" && preparer !== "" && selectedState !== "")
    : residency === "non-resident"
      ? (lastName.trim() !== "" && ssn.trim() !== "" && residentState !== "" && residentLicenseNumber.trim() !== "" && preparer !== "" && selectedStates.length > 0)
      : (lastName.trim() !== "" && ssn.trim() !== "" && confirmSsn.trim() !== "" && ssn === confirmSsn && preparer !== "" && selectedState !== "");

  const handleCheckAll = () => {
    setSelectedStates([...filteredStates]);
  };

  const handleUncheckAll = () => {
    setSelectedStates([]);
  };

  const handleStateToggle = (state: string) => {
    setSelectedStates(prev =>
      prev.includes(state)
        ? prev.filter(s => s !== state)
        : [...prev, state]
    );
  };

  // License Information step validation (for Resident Individual)
  const isLicenseInfoValid = licenseType !== "" && previouslyLicensed !== "";

  // Qualification step validation (for Resident Individual)
  const isQualificationValid = selectedQualifications.length > 0;

  const handleQualificationToggle = (qual: string) => {
    setSelectedQualifications(prev =>
      prev.includes(qual)
        ? prev.filter(q => q !== qual)
        : [...prev, qual]
    );
  };

  // Individual Details step validation (for Resident Individual)
  const isIndividualDetailsValid = 
    individualDetails.firstName.trim() !== "" &&
    individualDetails.lastName.trim() !== "" &&
    individualDetails.birthDate !== "" &&
    individualDetails.gender !== "" &&
    individualDetails.citizenCountryCode !== "" &&
    individualDetails.businessEmail.trim() !== "" &&
    individualDetails.applicantEmail.trim() !== "" &&
    individualDetails.residenceAddress.lineOne.trim() !== "" &&
    individualDetails.residenceAddress.city.trim() !== "" &&
    individualDetails.residenceAddress.postalCode.trim() !== "" &&
    individualDetails.residenceAddress.country !== "" &&
    individualDetails.businessAddress.lineOne.trim() !== "" &&
    individualDetails.businessAddress.city.trim() !== "" &&
    individualDetails.businessAddress.postalCode.trim() !== "" &&
    individualDetails.businessAddress.country !== "" &&
    individualDetails.mailingAddress.lineOne.trim() !== "" &&
    individualDetails.mailingAddress.city.trim() !== "" &&
    individualDetails.mailingAddress.postalCode.trim() !== "" &&
    individualDetails.mailingAddress.country !== "" &&
    individualDetails.residencePhone.trim() !== "" &&
    individualDetails.businessPhone.trim() !== "";

  // Sync SSN and lastName to individualDetails when they change
  const syncIndividualDetails = () => {
    if (individualDetails.ssn !== ssn || individualDetails.lastName !== lastName) {
      setIndividualDetails(prev => ({
        ...prev,
        ssn: ssn,
        lastName: lastName
      }));
    }
  };

  // Employment History step validation (for Resident Individual)
  const isEmploymentHistoryValid = employmentHistory.employmentEntries.some(entry =>
    entry.beginningDate.trim() !== "" &&
    entry.endingDate.trim() !== "" &&
    entry.employerName.trim() !== "" &&
    entry.city.trim() !== "" &&
    entry.country !== "" &&
    entry.positionDescription.trim() !== ""
  );

  // Background Questions step validation (for Resident Individual)
  const isBackgroundQuestionsValid = 
    backgroundQuestions.criminalConviction.answer !== "" &&
    backgroundQuestions.pendingCharges.answer !== "" &&
    backgroundQuestions.administrativeAction.answer !== "" &&
    backgroundQuestions.licenseRevoked.answer !== "" &&
    backgroundQuestions.civilJudgment.answer !== "" &&
    backgroundQuestions.bankruptcy.answer !== "" &&
    backgroundQuestions.enoInsurance.hasInsurance !== "" &&
    // If any "yes" answer, explanation must be provided
    (backgroundQuestions.criminalConviction.answer === "no" || backgroundQuestions.criminalConviction.explanation.trim() !== "") &&
    (backgroundQuestions.pendingCharges.answer === "no" || backgroundQuestions.pendingCharges.explanation.trim() !== "") &&
    (backgroundQuestions.administrativeAction.answer === "no" || backgroundQuestions.administrativeAction.explanation.trim() !== "") &&
    (backgroundQuestions.licenseRevoked.answer === "no" || backgroundQuestions.licenseRevoked.explanation.trim() !== "") &&
    (backgroundQuestions.civilJudgment.answer === "no" || backgroundQuestions.civilJudgment.explanation.trim() !== "") &&
    (backgroundQuestions.bankruptcy.answer === "no" || backgroundQuestions.bankruptcy.explanation.trim() !== "") &&
    // If has E&O insurance, must provide details
    (backgroundQuestions.enoInsurance.hasInsurance === "no" || (
      backgroundQuestions.enoInsurance.carrierName.trim() !== "" &&
      backgroundQuestions.enoInsurance.policyNumber.trim() !== "" &&
      backgroundQuestions.enoInsurance.expirationDate !== "" &&
      backgroundQuestions.enoInsurance.coverageAmount.trim() !== ""
    ));

  const isStep2Valid = selectedLicenseType !== "" && selectedLines.length > 0;

  const handleLineToggle = (lineId: string) => {
    setSelectedLines(prev => 
      prev.includes(lineId) 
        ? prev.filter(id => id !== lineId)
        : [...prev, lineId]
    );
  };

  const handleSubmit = () => {
    // In a real app, this would submit the application
    navigate("/agent/services/licensing/apply", {
      state: { success: true, message: "Application submitted successfully!" }
    });
  };

  const formatSSN = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  };

  const formatEIN = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  };

  const handleSsnChange = (value: string, setter: (val: string) => void) => {
    setter(formatSSN(value));
  };

  const handleEinChange = (value: string) => {
    setEin(formatEIN(value));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <button
        onClick={() => {
          if (currentStep === 2) {
            // Step 2 (Individual Details) goes back to 1.75
            setCurrentStep(1.75);
          } else if (currentStep === 2.25) {
            // Step 2.25 (Employment History) goes back to 2
            setCurrentStep(2);
          } else if (currentStep === 2.375) {
            // Step 2.375 (Background Questions) goes back to 2.25
            setCurrentStep(2.25);
          } else if (currentStep === 1.75) {
            setCurrentStep(1.5);
          } else if (currentStep === 1.5) {
            setCurrentStep(1);
          } else if (currentStep > 1) {
            // For Step 2.5, go back to 2.375 if it's Resident + Individual, else go to 1
            if (currentStep === 2.5 && residency === "resident" && entity === "individual") {
              setCurrentStep(2.375);
            } else {
              setCurrentStep(currentStep - 0.5);
            }
          } else {
            navigate(-1);
          }
        }}
        className="flex items-center gap-2 text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        {currentStep > 1 || currentStep === 1.5 || currentStep === 1.75 ? "Back" : "Exit"}
      </button>

      {/* Progress Steps - only show for steps 1-3 */}
      {currentStep > 0 && (
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => {
            // Map internal steps to display steps
            // 1, 1.5, 1.75 -> display step 1
            // 2, 2.25, 2.375 (Individual Details, Employment History, Background) -> display step 2
            // 2.5 (License Type) -> display step 2 (or treat as between 2-3)
            // 3 (Review) -> display step 3
            let displayStep = currentStep;
            if (currentStep === 1.5 || currentStep === 1.75) displayStep = 1;
            else if (currentStep === 2 || currentStep === 2.25 || currentStep === 2.375) displayStep = 2;
            else if (currentStep === 2.5) displayStep = 2;
            else if (currentStep === 3) displayStep = 3;
            
            const isActive = displayStep === s;
            const isCompleted = displayStep > s;
            
            return (
              <div key={s} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : isCompleted 
                        ? "bg-green-500 text-white" 
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <ChevronRight className={`w-5 h-5 mx-1 ${isCompleted ? "text-green-500" : "text-muted-foreground"}`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Step 0: Non-Resident - Resident State Selection */}
      {currentStep === 0 && residency === "non-resident" && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr_auto_auto] gap-4 items-center">
              <Label htmlFor="residentState" className="text-right sm:text-right">
                Resident State
              </Label>
              <Select
                value={residentState}
                onValueChange={(value) => {
                  setResidentState(value);
                  setCurrentStep(1);
                }}
              >
                <SelectTrigger className="max-w-[200px]">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {STATES_ELECTRONIC.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-destructive">* Required</span>
              <button
                type="button"
                onClick={() => setShowNoResidentLicensePopup(true)}
                className="text-primary hover:underline text-sm whitespace-nowrap"
              >
                I do not have a resident license
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Resident License Info Popup */}
      <Dialog open={showNoResidentLicensePopup} onOpenChange={setShowNoResidentLicensePopup}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>I do not have a resident license</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              There are certain states with licenses available that can be applied for without having an active resident license on the National Producer Database (PDB).
            </p>
            <p>
              If you have an active resident license on the PDB, you should enter your credentials on this page; you will still be able to apply for the licenses that do not require an active resident license.
            </p>
            <p>
              If you wish to apply for a resident license first{" "}
              <button
                type="button"
                onClick={() => {
                  setShowNoResidentLicensePopup(false);
                  navigate("/agent/services/licensing/apply/new?residency=resident&entity=individual");
                }}
                className="text-primary hover:underline"
              >
                click here
              </button>
            </p>
            <p>
              If you wish to apply for a non-resident license that does not require an active resident license on the PDB{" "}
              <button
                type="button"
                onClick={() => {
                  setShowNoResidentLicensePopup(false);
                  setCurrentStep(1);
                }}
                className="text-primary hover:underline"
              >
                click here
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Step 1: Personal Info & State Selection */}
      {currentStep === 1 && (
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Personal Information - Individual */}
            {entity === "individual" && (
              <div className="space-y-4">
                {/* Resident State dropdown for Non-Resident */}
                {residency === "non-resident" && (
                  <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto_auto] gap-4 items-center">
                    <Label htmlFor="residentStateForm" className="text-right sm:text-right">
                      Resident State
                    </Label>
                    <Select
                      value={residentState}
                      onValueChange={setResidentState}
                    >
                      <SelectTrigger className="max-w-[200px]">
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATES_ELECTRONIC.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-destructive">* Required</span>
                    <button
                      type="button"
                      onClick={() => setShowNoResidentLicensePopup(true)}
                      className="text-primary hover:underline text-sm whitespace-nowrap"
                    >
                      I do not have a resident license
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-4 items-center">
                  <Label htmlFor="lastName" className="text-right sm:text-right">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="max-w-xs"
                  />
                  <span className="text-sm text-destructive">* Required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-4 items-center">
                  <Label htmlFor="ssn" className="text-right sm:text-right">
                    SSN
                  </Label>
                  <div className="relative max-w-xs">
                    <Input
                      id="ssn"
                      type={showSsn ? "text" : "password"}
                      value={ssn}
                      onChange={(e) => handleSsnChange(e.target.value, setSsn)}
                      placeholder="XXX-XX-XXXX"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSsn(!showSsn)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showSsn ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <span className="text-sm text-destructive">* Required</span>
                </div>

                {/* Confirm SSN - only for resident individual */}
                {residency === "resident" && (
                  <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-4 items-center">
                    <Label htmlFor="confirmSsn" className="text-right sm:text-right">
                      Confirm SSN
                    </Label>
                    <div className="relative max-w-xs">
                      <Input
                        id="confirmSsn"
                        type={showConfirmSsn ? "text" : "password"}
                        value={confirmSsn}
                        onChange={(e) => handleSsnChange(e.target.value, setConfirmSsn)}
                        placeholder="XXX-XX-XXXX"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmSsn(!showConfirmSsn)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmSsn ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <span className="text-sm text-destructive">* Required</span>
                  </div>
                )}

                {/* Resident License Number for Non-Resident */}
                {residency === "non-resident" && (
                  <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-4 items-center">
                    <Label htmlFor="residentLicenseNumber" className="text-right sm:text-right">
                      Resident License Number
                    </Label>
                    <Input
                      id="residentLicenseNumber"
                      value={residentLicenseNumber}
                      onChange={(e) => setResidentLicenseNumber(e.target.value)}
                      className="max-w-xs"
                    />
                    <span className="text-sm text-destructive">* Required</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-4 items-center">
                  <Label className="text-right sm:text-right">Preparer</Label>
                  <RadioGroup
                    value={preparer}
                    onValueChange={setPreparer}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="applicant" id="applicant" />
                      <Label htmlFor="applicant" className="font-normal cursor-pointer">Applicant</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="authorized" id="authorized" />
                      <Label htmlFor="authorized" className="font-normal cursor-pointer">Authorized Submitter</Label>
                    </div>
                  </RadioGroup>
                  <span className="text-sm text-destructive">* Required</span>
                </div>
              </div>
            )}

            {/* Firm Information */}
            {entity === "firm" && (
              <div className="space-y-4">
                {/* Resident State dropdown for Non-Resident Firm */}
                {residency === "non-resident" && (
                  <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto_auto] gap-4 items-center">
                    <Label htmlFor="residentStateFirm" className="text-right sm:text-right">
                      Resident State
                    </Label>
                    <Select
                      value={residentState}
                      onValueChange={setResidentState}
                    >
                      <SelectTrigger className="max-w-[200px]">
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATES_ELECTRONIC.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-destructive">* Required</span>
                    <button
                      type="button"
                      onClick={() => setShowNoResidentLicensePopup(true)}
                      className="text-primary hover:underline text-sm whitespace-nowrap"
                    >
                      I do not have a resident license
                    </button>
                  </div>
                )}

                {/* Firm Name - only for Resident Firm */}
                {residency === "resident" && (
                  <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-4 items-center">
                    <Label htmlFor="firmName" className="text-right sm:text-right">
                      Firm Name
                    </Label>
                    <Input
                      id="firmName"
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      className="max-w-xs"
                    />
                    <span className="text-sm text-destructive">* Required</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-4 items-center">
                  <Label htmlFor="ein" className="text-right sm:text-right">
                    EIN
                  </Label>
                  <Input
                    id="ein"
                    value={ein}
                    onChange={(e) => handleEinChange(e.target.value)}
                    placeholder="XX-XXXXXXX"
                    className="max-w-[120px]"
                  />
                  <span className="text-sm text-destructive">* Required</span>
                </div>

                {/* Resident License Number for Non-Resident Firm */}
                {residency === "non-resident" && (
                  <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-4 items-center">
                    <Label htmlFor="residentLicenseNumberFirm" className="text-right sm:text-right">
                      Resident License Number
                    </Label>
                    <Input
                      id="residentLicenseNumberFirm"
                      value={residentLicenseNumber}
                      onChange={(e) => setResidentLicenseNumber(e.target.value)}
                      className="max-w-xs"
                    />
                    <span className="text-sm text-destructive">* Required</span>
                  </div>
                )}

                {/* Agency Type - only for Non-Resident Firm */}
                {residency === "non-resident" && (
                  <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-4 items-center">
                    <Label htmlFor="agencyType" className="text-right sm:text-right">
                      Agency Type
                    </Label>
                    <Select
                      value={agencyType}
                      onValueChange={setAgencyType}
                    >
                      <SelectTrigger className="max-w-[250px]">
                        <SelectValue placeholder="Select agency type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporation">Corporation</SelectItem>
                        <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="llp">Limited Liability Partnership (LLP)</SelectItem>
                        <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-destructive">* Required</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-4 items-center">
                  <Label className="text-right sm:text-right">Preparer</Label>
                  <RadioGroup
                    value={preparer}
                    onValueChange={setPreparer}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="applicant" id="applicant-firm" />
                      <Label htmlFor="applicant-firm" className="font-normal cursor-pointer">Applicant</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="authorized" id="authorized-firm" />
                      <Label htmlFor="authorized-firm" className="font-normal cursor-pointer">Authorized Submitter</Label>
                    </div>
                  </RadioGroup>
                  <span className="text-sm text-destructive">* Required</span>
                </div>
              </div>
            )}

            {/* Paper Copy Notice */}
            <p className="text-center text-primary italic font-medium">
              A paper copy of each requested license application will be generated at the end of the process regardless of submission method(s).
            </p>

            {/* California Notices for Firm */}
            {entity === "firm" && (
              <div className="text-sm space-y-3 text-muted-foreground">
                <p>
                  CALIFORNIA - Sole proprietorship may not apply electronically using the business entity uniform application, they must apply as an individual.
                </p>
                <p>
                  CALIFORNIA - Business Entities applying as a Limited Liability Company (LLC's): LLC's are required to provide proof of satisfying the security requirements of Section 1647.5 of the California Insurance Code when applying for an insurance license and once licensed, must also file with the Commissioner an annual confirmation of coverage demonstrating continued compliance with the financial security requirements. Additional LLC application filing information, annual certification of coverage information, and links to forms that can be used as proof of fulfilling the security requirements, please go to the following link for Business Entity Limited Liability Company Requirements (http://www.insurance.ca.gov/0200-industry/0020-apply-license/0300-business-license/business-entity-limited-liability.cfm)
                </p>
                <p>
                  Attention Georgia Applicants: You are required to submit Citizenship Affidavit Form GID-276-EN with your application. Please copy and paste the following link into your browser to get the Citizenship Affidavit form: https://oci.georgia.gov/citizenship-affidavit.
                </p>
              </div>
            )}

            {/* States Section - Different for Resident vs Non-Resident */}
            {residency === "non-resident" ? (
              /* Non-Resident Individual: Checkboxes with filter */
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-900 text-white px-4 py-3 text-center font-semibold">
                  States
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Some states will accept license applications submitted electronically, while other states will accept only paper applications. If you are applying to a state or states accepting electronic applications, Sircon will collect your information and submit your application electronically. For paper only states, you must print paper copies of the forms and mail them to the appropriate state offices.
                  </p>

                  {/* Filter Radio Buttons */}
                  <RadioGroup
                    value={stateFilter}
                    onValueChange={(value) => setStateFilter(value as "electronic" | "all")}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="electronic" id="filter-electronic" />
                      <Label htmlFor="filter-electronic" className="font-medium cursor-pointer">
                        Show states accepting electronic applications
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="filter-all" />
                      <Label htmlFor="filter-all" className="font-medium cursor-pointer">
                        Show all states
                      </Label>
                    </div>
                  </RadioGroup>

                  <p className="text-sm text-muted-foreground">
                    Not all license types are available in all states. Click on a state name below to view the license types available in that state. If the type you seek is not available, do not continue for that state. Instead you will need to contact the state to find out their requirements for application.
                  </p>

                  {/* State Checkboxes Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {filteredStates.map((state) => (
                      <div key={state} className="flex items-center space-x-2">
                        <Checkbox
                          id={`state-checkbox-${state.replace(/\s/g, "-")}`}
                          checked={selectedStates.includes(state)}
                          onCheckedChange={() => handleStateToggle(state)}
                          className="shrink-0"
                        />
                        <button
                          type="button"
                          className="text-sm text-primary hover:underline text-left truncate"
                          onClick={() => setViewingState(state)}
                        >
                          {state}
                          {PAPER_ONLY_STATES.includes(state) && (
                            <span className="ml-1 text-muted-foreground">📄</span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Check All / Uncheck All Buttons */}
                  <div className="flex justify-center gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={handleCheckAll}>
                      Check All
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleUncheckAll}>
                      Uncheck All
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground text-center italic">
                    Click on a state name to view the license types available for each submission method.
                  </p>
                  <p className="text-sm text-muted-foreground text-center">
                    📄 = Paper Application only
                  </p>
                </div>

                {/* State License Types Dialog */}
                <Dialog open={viewingState !== null} onOpenChange={(open) => !open && setViewingState(null)}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader className="bg-gray-900 text-white -m-6 mb-4 p-4 rounded-t-lg">
                      <DialogTitle className="text-center text-white">
                        {viewingState}: License Types accepted through Electronic submission
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center">
                      <table className="border-collapse border border-foreground">
                        <thead>
                          <tr>
                            <th className="border border-foreground px-6 py-2 font-semibold">License Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewingState && STATE_LICENSE_TYPES[viewingState]?.map((licenseType) => (
                            <tr key={licenseType}>
                              <td className="border border-foreground px-6 py-1 text-center text-sm">
                                {licenseType}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-center pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setViewingState(null)}
                      >
                        Close This Window
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              /* Resident: Radio button selection */
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-900 text-white px-4 py-3 text-center font-semibold">
                  States Accepting Electronic License Applications
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Click on a state name to view the license types available for each submission method.
                  </p>
                  <RadioGroup
                    value={selectedState}
                    onValueChange={setSelectedState}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
                  >
                    {STATES_ELECTRONIC.map((state) => (
                      <div key={state} className="flex items-center space-x-2">
                        <RadioGroupItem value={state} id={state.replace(/\s/g, "-")} className="shrink-0" />
                        <Label
                          htmlFor={state.replace(/\s/g, "-")}
                          className={`text-sm cursor-pointer truncate ${
                            selectedState === state ? "text-foreground font-medium" : "text-foreground hover:text-primary"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            setViewingState(state);
                          }}
                        >
                          {state}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {/* State License Types Dialog */}
                  <Dialog open={viewingState !== null} onOpenChange={(open) => !open && setViewingState(null)}>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader className="bg-gray-900 text-white -m-6 mb-4 p-4 rounded-t-lg">
                        <DialogTitle className="text-center text-white">
                          {viewingState}: License Types accepted through Electronic submission
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-center">
                        <table className="border-collapse border border-foreground">
                          <thead>
                            <tr>
                              <th className="border border-foreground px-6 py-2 font-semibold">License Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {viewingState && STATE_LICENSE_TYPES[viewingState]?.map((licenseType) => (
                              <tr key={licenseType}>
                                <td className="border border-foreground px-6 py-1 text-center text-sm">
                                  {licenseType}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-center pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedState(viewingState || "");
                            setViewingState(null);
                          }}
                          className="mr-2"
                        >
                          Select This State
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setViewingState(null)}
                        >
                          Close This Window
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}

            {/* States Accepting Paper Applications */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-900 text-white px-4 py-3 text-center font-semibold">
                States Accepting Paper License Applications
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground text-center italic">
                  There are currently no states accepting paper license applications.
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-900 text-white px-4 py-3 text-center font-semibold">
                Payment Method
              </div>
              <div className="p-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="credit-card" id="credit-card" className="mt-1" />
                    <div>
                      <Label htmlFor="credit-card" className="font-medium cursor-pointer">
                        Credit Card/Electronic Check Submission
                      </Label>
                      <p className="text-sm text-muted-foreground italic mt-1">
                        ** We accept VISA, MASTERCARD, AMERICAN EXPRESS, DISCOVER and electronic checks. **
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="carrier-pay" id="carrier-pay" className="mt-1" />
                    <div>
                      <Label htmlFor="carrier-pay" className="font-normal cursor-pointer">
                        For insurance licensees only: I am actively working with a Sircon insurance carrier, agency or partner who is responsible for all or part of the transaction fee.
                      </Label>
                      <p className="text-sm text-muted-foreground italic mt-1">
                        ** We accept VISA, MASTERCARD, AMERICAN EXPRESS, DISCOVER and electronic checks. **
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="carrier-submit" id="carrier-submit" className="mt-1" />
                    <div>
                      <Label htmlFor="carrier-submit" className="font-normal cursor-pointer">
                        For insurance licensees only: I am actively working with a Sircon insurance carrier, agency or partner to obtain licensure.
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Notice */}
            <Alert className="bg-muted/50 border-muted">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm italic">
                If you are an insurance licensee, the information on the following pages may include information provided from the National Insurance Producer Registry's Producer Database and may contain information subject to the Fair Credit Reporting Act.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4 border-t">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button 
                disabled={!isStep1Valid}
                onClick={() => {
                  // For Resident + Individual, go to License Information step (1.5)
                  if (residency === "resident" && entity === "individual") {
                    setCurrentStep(1.5);
                  } else {
                    // Non-resident or firm flows go directly to License Type step (2.5)
                    setCurrentStep(2.5);
                  }
                }}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1.5: License Information (Resident + Individual only) */}
      {currentStep === 1.5 && residency === "resident" && entity === "individual" && (
        <Card>
          <CardContent className="p-0">
            {/* Notice */}
            <div className="border-b p-4">
              <p className="text-sm">
                Not all license types are available in all states. If the license type that you seek is not listed, please contact the state directly and do not apply at this time. State contact information can be found here:{" "}
                <button type="button" className="text-primary hover:underline">
                  State Information Center
                </button>
              </p>
            </div>

            {/* License Information Header */}
            <div className="bg-orange-500 text-white px-4 py-2 text-center font-semibold">
              License Information
            </div>

            {/* State-specific Warning */}
            {selectedState && (
              <div className="bg-orange-100 border-orange-300 border-b px-4 py-2 text-center italic text-sm">
                {selectedState === "Alabama" && (
                  <p>Adjuster applicants must have business address in the state of Alabama. If Adjuster applicant's business address is not in Alabama, DO NOT SUBMIT THE APPLICATION ONLINE AS IT WILL BE REJECTED.</p>
                )}
                {selectedState !== "Alabama" && (
                  <p>Please review license requirements for {selectedState} before proceeding.</p>
                )}
              </div>
            )}

            {/* License Form */}
            <div className="p-6 space-y-4">
              {/* State Display */}
              <div className="flex items-center gap-4">
                <Label className="font-semibold min-w-[120px] text-right">State</Label>
                <span>{selectedState}</span>
              </div>

              {/* License Type */}
              <div className="flex items-start gap-4">
                <Label className="font-semibold min-w-[120px] text-right pt-1">License Type</Label>
                <RadioGroup
                  value={licenseType}
                  onValueChange={setLicenseType}
                  className="space-y-2"
                >
                  {STATE_LICENSE_TYPES[selectedState]?.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={`license-type-${type.replace(/\s/g, "-")}`} />
                      <Label 
                        htmlFor={`license-type-${type.replace(/\s/g, "-")}`}
                        className="font-normal cursor-pointer"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Previously Licensed */}
              <div className="flex items-center gap-4">
                <Label className="font-semibold min-w-[120px] text-right">Previously licensed ?</Label>
                <RadioGroup
                  value={previouslyLicensed}
                  onValueChange={(value) => setPreviouslyLicensed(value as "yes" | "no")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="previously-yes" />
                    <Label htmlFor="previously-yes" className="font-normal cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="previously-no" />
                    <Label htmlFor="previously-no" className="font-normal cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button 
                disabled={!isLicenseInfoValid}
                onClick={() => setCurrentStep(1.75)}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1.75: Qualification Information (Resident + Individual only) */}
      {currentStep === 1.75 && residency === "resident" && entity === "individual" && (
        <Card>
          <CardContent className="p-0">
            {/* Notice */}
            <div className="border-b p-4">
              <p className="text-sm text-center italic">
                Lines of authority that are currently held by the licensee in the resident state will appear below,
                but they will not be selectable.
              </p>
            </div>

            {/* Qualification Information Header */}
            <div className="bg-orange-500 text-white px-4 py-2 text-center font-semibold">
              Qualification Information for State of {selectedState}: {licenseType}
            </div>

            {/* View State Requirements Link */}
            <div className="text-center py-2">
              <button type="button" className="text-primary hover:underline text-sm">
                View State Requirements ↗
              </button>
            </div>

            {/* State-specific Warnings */}
            <div className="px-4 py-2 text-center text-sm space-y-2">
              <p className="italic">
                Adjuster license applications may NOT be submitted online through this producer license application.
              </p>
              {selectedState === "Alabama" && licenseType === "Insurance Producer" && (
                <p className="font-semibold">
                  Applicant must also hold a or be applying for Health LOA when applying for Dental Services, or the application will be declined because of that.
                </p>
              )}
            </div>

            {/* Qualification Code Section */}
            <div className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Qualification Code</h3>
                <p className="text-sm text-muted-foreground">* At least one qualification must be selected.</p>
              </div>

              {/* Qualification Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {(QUALIFICATION_CODES[licenseType] || QUALIFICATION_CODES["Insurance Producer"] || []).map((qual) => (
                  <div key={qual} className="flex items-center space-x-2">
                    <Checkbox
                      id={`qual-${qual.replace(/\s/g, "-")}`}
                      checked={selectedQualifications.includes(qual)}
                      onCheckedChange={() => handleQualificationToggle(qual)}
                    />
                    <Label 
                      htmlFor={`qual-${qual.replace(/\s/g, "-")}`}
                      className="font-normal cursor-pointer text-sm"
                    >
                      {qual}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep(1.5)}>
                Back
              </Button>
              <Button 
                disabled={!isQualificationValid}
                onClick={() => {
                  syncIndividualDetails();
                  setCurrentStep(2);
                }}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Individual Details (Resident + Individual only) */}
      {currentStep === 2 && residency === "resident" && entity === "individual" && (
        <Card>
          <CardContent className="p-0">
            <IndividualDetailsForm
              data={individualDetails}
              onChange={setIndividualDetails}
              selectedState={selectedState}
            />

            {/* Action Buttons */}
            <div className="flex justify-center gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep(1.75)}>
                Back
              </Button>
              <Button 
                disabled={!isIndividualDetailsValid}
                onClick={() => setCurrentStep(2.25)}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2.25: Employment History (Resident + Individual only) */}
      {currentStep === 2.25 && residency === "resident" && entity === "individual" && (
        <Card>
          <CardContent className="p-0">
            <EmploymentHistoryForm
              data={employmentHistory}
              onChange={setEmploymentHistory}
            />

            {/* Action Buttons */}
            <div className="flex justify-center gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button 
                disabled={!isEmploymentHistoryValid}
                onClick={() => setCurrentStep(2.375)}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2.375: Background Questions (Resident + Individual only) */}
      {currentStep === 2.375 && residency === "resident" && entity === "individual" && (
        <Card>
          <CardContent className="p-0">
            <BackgroundQuestionsForm
              data={backgroundQuestions}
              onChange={setBackgroundQuestions}
            />

            {/* Action Buttons */}
            <div className="flex justify-center gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep(2.25)}>
                Back
              </Button>
              <Button 
                disabled={!isBackgroundQuestionsValid}
                onClick={() => setCurrentStep(2.5)}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2.5: License Type & Lines of Authority */}
      {currentStep === 2.5 && (
        <Card>
          <CardHeader>
            <CardTitle>Select License Type & Lines of Authority</CardTitle>
            <p className="text-sm text-muted-foreground">
              Applying for: <Badge variant="secondary">{selectedState}</Badge>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* License Type Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">License Type</Label>
              <RadioGroup
                value={selectedLicenseType}
                onValueChange={setSelectedLicenseType}
                className="grid gap-3"
              >
                {LICENSE_TYPES.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedLicenseType === type.id 
                        ? "border-primary bg-primary/5" 
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedLicenseType(type.id)}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={type.id} id={type.id} />
                      <div>
                        <Label htmlFor={type.id} className="font-medium cursor-pointer">{type.name}</Label>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Lines of Authority */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Lines of Authority</Label>
              <p className="text-sm text-muted-foreground">Select one or more lines of authority for your license.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {LINES_OF_AUTHORITY.map((line) => (
                  <div
                    key={line.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedLines.includes(line.id)
                        ? "border-primary bg-primary/5" 
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => handleLineToggle(line.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={line.id}
                        checked={selectedLines.includes(line.id)}
                        onCheckedChange={() => handleLineToggle(line.id)}
                      />
                      <Label htmlFor={line.id} className="font-medium cursor-pointer">
                        {line.name}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4 border-t">
              <Button variant="outline" onClick={() => {
                // For Resident + Individual, go back to Individual Details step
                if (residency === "resident" && entity === "individual") {
                  setCurrentStep(2);
                } else {
                  setCurrentStep(1);
                }
              }}>
                Back
              </Button>
              <Button 
                disabled={!isStep2Valid}
                onClick={() => setCurrentStep(3)}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Submit */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Submit Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Please review your application details before submitting.
            </p>

            <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
              <div className="grid gap-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Residency Type:</span>
                  <span className="font-medium capitalize">{residency}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Entity Type:</span>
                  <span className="font-medium capitalize">{entity}</span>
                </div>
                {residency === "non-resident" && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-sm text-muted-foreground">Resident State:</span>
                    <span className="font-medium">{residentState}</span>
                  </div>
                )}
                {entity === "individual" ? (
                  <>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-muted-foreground">Last Name:</span>
                      <span className="font-medium">{lastName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-muted-foreground">SSN:</span>
                      <span className="font-medium">***-**-{ssn.slice(-4)}</span>
                    </div>
                    {residency === "non-resident" && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-sm text-muted-foreground">Resident License Number:</span>
                        <span className="font-medium">{residentLicenseNumber}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {residency === "resident" && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-sm text-muted-foreground">Firm Name:</span>
                        <span className="font-medium">{firmName}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm text-muted-foreground">EIN:</span>
                      <span className="font-medium">{ein}</span>
                    </div>
                    {residency === "non-resident" && (
                      <>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-sm text-muted-foreground">Resident License Number:</span>
                          <span className="font-medium">{residentLicenseNumber}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-sm text-muted-foreground">Agency Type:</span>
                          <span className="font-medium capitalize">{agencyType.replace("-", " ")}</span>
                        </div>
                      </>
                    )}
                  </>
                )}
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Preparer:</span>
                  <span className="font-medium capitalize">{preparer}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">State(s):</span>
                  <span className="font-medium">{residency === "non-resident" ? selectedStates.join(", ") : selectedState}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">License Type:</span>
                  <span className="font-medium capitalize">{selectedLicenseType}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Lines of Authority:</span>
                  <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                    {selectedLines.map(line => (
                      <Badge key={line} variant="secondary" className="capitalize">
                        {LINES_OF_AUTHORITY.find(l => l.id === line)?.name || line}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                By submitting this application, you certify that all information provided is accurate and complete. 
                False statements may result in denial or revocation of your license.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4 border-t">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button onClick={handleSubmit}>
                Submit Application
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewInsuranceLicensePage;
