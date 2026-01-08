import { useState } from "react";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AliasEntry {
  id: string;
  type: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
}

interface AddressData {
  lineOne: string;
  lineTwo: string;
  lineThree: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IndividualDetailsData {
  // Individual Information
  ssn: string;
  npn: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthDate: string;
  gender: string;
  citizenCountryCode: string;
  businessEmail: string;
  applicantEmail: string;
  businessWebsite: string;
  finraCrdIdentifier: string;
  
  // Alias Information
  aliases: AliasEntry[];
  
  // Addresses
  residenceAddress: AddressData;
  businessAddress: AddressData;
  mailingAddress: AddressData;
  
  // Phone Information
  residencePhone: string;
  businessPhone: string;
  businessPhoneExt: string;
  faxNumber: string;
}

interface IndividualDetailsFormProps {
  data: IndividualDetailsData;
  onChange: (data: IndividualDetailsData) => void;
  selectedState: string;
}

const COUNTRIES = [
  "United States",
  "Canada",
  "Mexico",
  "United Kingdom",
  "Germany",
  "France",
  "India",
  "China",
  "Japan",
  "Australia",
  "Other"
];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
  "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas",
  "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const ALIAS_TYPES = [
  { value: "", label: "" },
  { value: "alias", label: "Alias" },
  { value: "dba", label: "Doing Business As" },
  { value: "previously", label: "Previously/Formerly Known As" }
];

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" }
];

const SUFFIXES = ["Jr", "Sr", "I", "II", "III", "IV", "V"];

const IndividualDetailsForm = ({ data, onChange, selectedState }: IndividualDetailsFormProps) => {
  const updateField = <K extends keyof IndividualDetailsData>(
    field: K,
    value: IndividualDetailsData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const updateAddress = (
    type: "residenceAddress" | "businessAddress" | "mailingAddress",
    field: keyof AddressData,
    value: string
  ) => {
    onChange({
      ...data,
      [type]: { ...data[type], [field]: value }
    });
  };

  const copyAddress = (
    target: "residenceAddress" | "businessAddress" | "mailingAddress",
    source: "residenceAddress" | "businessAddress" | "mailingAddress"
  ) => {
    if (source === target) return;
    onChange({
      ...data,
      [target]: { ...data[source] }
    });
  };

  const addAlias = () => {
    const newAlias: AliasEntry = {
      id: `alias-${Date.now()}`,
      type: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: ""
    };
    onChange({ ...data, aliases: [...data.aliases, newAlias] });
  };

  const updateAlias = (id: string, field: keyof AliasEntry, value: string) => {
    onChange({
      ...data,
      aliases: data.aliases.map(a => a.id === id ? { ...a, [field]: value } : a)
    });
  };

  const removeAlias = (id: string) => {
    onChange({
      ...data,
      aliases: data.aliases.filter(a => a.id !== id)
    });
  };

  const CompactAddressSection = ({
    title,
    type,
    notice,
    showCopyFrom = true
  }: {
    title: string;
    type: "residenceAddress" | "businessAddress" | "mailingAddress";
    notice?: string;
    showCopyFrom?: boolean;
  }) => {
    const address = data[type];
    const copyOptions = [
      { value: "residenceAddress", label: "Residence" },
      { value: "businessAddress", label: "Business" },
      { value: "mailingAddress", label: "Mailing" }
    ].filter(opt => opt.value !== type);

    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-orange-500 text-white px-3 py-1.5 text-center font-semibold text-sm">
          {title}
        </div>
        {notice && (
          <p className="text-xs text-muted-foreground text-center italic px-2 py-1 bg-orange-50">{notice}</p>
        )}
        <div className="p-3 space-y-2">
          {showCopyFrom && (
            <div className="flex items-center gap-2">
              <Label className="text-xs shrink-0">Copy From:</Label>
              <Select onValueChange={(val) => copyAddress(type, val as "residenceAddress" | "businessAddress" | "mailingAddress")}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {copyOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-3">
            <div className="flex flex-col">
              <Label className="text-xs mb-1 h-4">Line One <span className="text-destructive">*</span></Label>
              <Input className="h-8 text-sm" value={address.lineOne} onChange={(e) => updateAddress(type, "lineOne", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <Label className="text-xs mb-1 h-4">Line Two</Label>
                <Input className="h-8 text-sm" value={address.lineTwo} onChange={(e) => updateAddress(type, "lineTwo", e.target.value)} />
              </div>
              <div className="flex flex-col">
                <Label className="text-xs mb-1 h-4">Line Three</Label>
                <Input className="h-8 text-sm" value={address.lineThree} onChange={(e) => updateAddress(type, "lineThree", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <Label className="text-xs mb-1 h-4">City <span className="text-destructive">*</span></Label>
                <Input className="h-8 text-sm" value={address.city} onChange={(e) => updateAddress(type, "city", e.target.value)} />
              </div>
              <div className="flex flex-col">
                <Label className="text-xs mb-1 h-4">State</Label>
                <Select value={address.state} onValueChange={(val) => updateAddress(type, "state", val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <Label className="text-xs mb-1 h-4">Postal Code <span className="text-destructive">*</span></Label>
                <Input className="h-8 text-sm" value={address.postalCode} onChange={(e) => updateAddress(type, "postalCode", e.target.value)} maxLength={10} />
              </div>
              <div className="flex flex-col">
                <Label className="text-xs mb-1 h-4">Country <span className="text-destructive">*</span></Label>
                <Select value={address.country} onValueChange={(val) => updateAddress(type, "country", val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4">
      {/* Individual Information - Two column layout */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-orange-500 text-white px-4 py-2 text-center font-semibold">
          Individual Information
        </div>
        <p className="text-xs text-muted-foreground text-center italic px-4 py-2 bg-orange-50">
          If applying for variable line of authority, the FINRA CRD number is required. The e-mail address entered is where the license application confirmation will be sent.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 p-4">
          <div className="flex flex-col">
            <Label className="text-xs mb-1 h-4">SSN <span className="text-destructive">*</span></Label>
            <Input value={data.ssn} disabled className="h-8 text-sm bg-muted" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 h-4 mb-1">
              <Label className="text-xs">National Producer Number</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><HelpCircle className="h-3 w-3 text-primary" /></TooltipTrigger>
                  <TooltipContent><p className="max-w-xs text-xs">Your NPN is a unique identifier assigned by the NIPR.</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input className="h-8 text-sm" value={data.npn} onChange={(e) => updateField("npn", e.target.value)} />
          </div>
          <div className="flex flex-col">
            <Label className="text-xs mb-1 h-4">First Name <span className="text-destructive">*</span></Label>
            <Input className="h-8 text-sm" value={data.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
          </div>
          <div className="flex flex-col">
            <Label className="text-xs mb-1 h-4">Middle Name</Label>
            <Input className="h-8 text-sm" value={data.middleName} onChange={(e) => updateField("middleName", e.target.value)} />
          </div>
          <div className="flex flex-col">
            <Label className="text-xs mb-1 h-4">Last Name <span className="text-destructive">*</span></Label>
            <Input className="h-8 text-sm" value={data.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
          </div>
          <div className="flex flex-col">
            <Label className="text-xs mb-1 h-4">Suffix</Label>
            <Select value={data.suffix} onValueChange={(val) => updateField("suffix", val)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {SUFFIXES.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <Label className="text-xs mb-1 h-4">Birth Date <span className="text-destructive">*</span></Label>
            <Input type="date" className="h-8 text-sm" value={data.birthDate} onChange={(e) => updateField("birthDate", e.target.value)} />
          </div>
          <div className="flex flex-col">
            <Label className="text-xs mb-1 h-4">Gender <span className="text-destructive">*</span></Label>
            <Select value={data.gender} onValueChange={(val) => updateField("gender", val)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map(g => (<SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <Label className="text-xs mb-1 h-4">Citizen Country <span className="text-destructive">*</span></Label>
            <Select value={data.citizenCountryCode} onValueChange={(val) => updateField("citizenCountryCode", val)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map(country => (<SelectItem key={country} value={country}>{country}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <Label className="text-xs mb-1 h-4">Business Email <span className="text-destructive">*</span></Label>
            <Input type="email" className="h-8 text-sm" value={data.businessEmail} onChange={(e) => updateField("businessEmail", e.target.value)} />
          </div>
          <div className="flex flex-col">
            <Label className="text-xs mb-1 h-4">Applicant Email <span className="text-destructive">*</span></Label>
            <Input type="email" className="h-8 text-sm" value={data.applicantEmail} onChange={(e) => updateField("applicantEmail", e.target.value)} />
          </div>
          <div className="flex flex-col">
            <Label className="text-xs mb-1 h-4">Business Website</Label>
            <Input type="url" className="h-8 text-sm" value={data.businessWebsite} onChange={(e) => updateField("businessWebsite", e.target.value)} placeholder="https://" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 h-4 mb-1">
              <Label className="text-xs">FINRA CRD Identifier</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><button type="button" className="text-primary hover:underline text-xs">What's this?</button></TooltipTrigger>
                  <TooltipContent><p className="max-w-xs text-xs">Required for variable products.</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input className="h-8 text-sm" value={data.finraCrdIdentifier} onChange={(e) => updateField("finraCrdIdentifier", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Individual Alias Information */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-orange-500 text-white px-4 py-2 text-center font-semibold">
          Individual Alias Information (Optional)
        </div>
        <p className="text-xs text-muted-foreground text-center italic px-4 py-1 bg-orange-50">
          The information in this section is optional. If you elect to provide this information, please enter all required fields.
        </p>
        <p className="text-xs text-muted-foreground text-center px-4 py-1 bg-orange-50">
          List any other assumed, fictitious, alias, maiden or trade names which you have used in the past. List any trade names under which you are currently doing business or intend to do business. (May be subject to state approval)
        </p>
        
        <div className="p-4 space-y-4">
          {data.aliases.map((alias, index) => (
            <div key={alias.id} className="border rounded-lg p-4 relative bg-muted/20">
              {index > 0 && (
                <button type="button" onClick={() => removeAlias(alias.id)} className="absolute top-2 right-2 text-destructive hover:text-destructive/80">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-24 text-right shrink-0">Type</Label>
                    <Select value={alias.type} onValueChange={(val) => updateAlias(alias.id, "type", val)}>
                      <SelectTrigger className="h-8 text-sm flex-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {ALIAS_TYPES.map(type => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <span className="text-destructive text-xs">* Required</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-24 text-right shrink-0">First Name</Label>
                    <Input className="h-8 text-sm flex-1" value={alias.firstName} onChange={(e) => updateAlias(alias.id, "firstName", e.target.value)} />
                    <span className="text-destructive text-xs">* Required</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-24 text-right shrink-0">Middle Name</Label>
                    <Input className="h-8 text-sm flex-1" value={alias.middleName} onChange={(e) => updateAlias(alias.id, "middleName", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-24 text-right shrink-0">Last Name</Label>
                    <Input className="h-8 text-sm flex-1" value={alias.lastName} onChange={(e) => updateAlias(alias.id, "lastName", e.target.value)} />
                    <span className="text-destructive text-xs">* Required</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-24 text-right shrink-0">Suffix Name</Label>
                    <Select value={alias.suffix} onValueChange={(val) => updateAlias(alias.id, "suffix", val)}>
                      <SelectTrigger className="h-8 text-sm w-20">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUFFIXES.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Button type="button" variant="outline" size="sm" onClick={addAlias} className="w-full border-dashed">
            <Plus className="h-4 w-4 mr-2" />
            Add More Individual Alias Information
          </Button>
        </div>
      </div>

      {/* Addresses - Three columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CompactAddressSection
          title="Residence Address"
          type="residenceAddress"
          notice="Must not contain a PO box."
          showCopyFrom={false}
        />
        <CompactAddressSection
          title="Business Address"
          type="businessAddress"
          notice={selectedState === "Alabama" ? "Adjuster applicants must have AL business address." : undefined}
        />
        <CompactAddressSection
          title="Mailing Address"
          type="mailingAddress"
        />
      </div>

      {/* Phone Information - All in one row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-orange-500 text-white px-3 py-1.5 text-center font-semibold text-sm">
            Residence Phone
          </div>
          <div className="p-3">
            <div className="flex flex-col">
              <Label className="text-xs mb-1 h-4">Phone Number <span className="text-destructive">*</span></Label>
              <Input type="tel" className="h-8 text-sm" value={data.residencePhone} onChange={(e) => updateField("residencePhone", e.target.value)} placeholder="(XXX) XXX-XXXX" />
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-orange-500 text-white px-3 py-1.5 text-center font-semibold text-sm">
            Business Phone
          </div>
          <div className="p-3 grid grid-cols-3 gap-2">
            <div className="col-span-2 flex flex-col">
              <Label className="text-xs mb-1 h-4">Phone <span className="text-destructive">*</span></Label>
              <Input type="tel" className="h-8 text-sm" value={data.businessPhone} onChange={(e) => updateField("businessPhone", e.target.value)} placeholder="(XXX) XXX-XXXX" />
            </div>
            <div className="flex flex-col">
              <Label className="text-xs mb-1 h-4">Ext</Label>
              <Input className="h-8 text-sm" value={data.businessPhoneExt} onChange={(e) => updateField("businessPhoneExt", e.target.value)} maxLength={6} />
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-orange-500 text-white px-3 py-1.5 text-center font-semibold text-sm">
            Business Fax (Optional)
          </div>
          <div className="p-3">
            <div className="flex flex-col">
              <Label className="text-xs mb-1 h-4">Fax Number</Label>
              <Input type="tel" className="h-8 text-sm" value={data.faxNumber} onChange={(e) => updateField("faxNumber", e.target.value)} placeholder="(XXX) XXX-XXXX" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualDetailsForm;
