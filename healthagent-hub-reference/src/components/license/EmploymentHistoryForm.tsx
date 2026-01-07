import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
  "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

const COUNTRIES = [
  "United States", "Canada", "Mexico", "United Kingdom", "Germany", "France",
  "Australia", "Japan", "China", "India", "Brazil", "Other"
];

const EMPLOYMENT_TYPES = [
  { value: "", label: "" },
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "military", label: "Military Service" },
  { value: "unemployed", label: "Unemployed" },
  { value: "education", label: "Full-Time Education" }
];

export interface EmploymentEntry {
  id: string;
  currentEmployment: boolean;
  employmentType: string;
  beginningDate: string;
  endingDate: string;
  employerName: string;
  city: string;
  state: string;
  province: string;
  country: string;
  positionDescription: string;
}

export interface AffiliationEntry {
  id: string;
  agencyName: string;
  agencyEin: string;
}

export interface EmploymentHistoryData {
  employmentEntries: EmploymentEntry[];
  affiliationEntries: AffiliationEntry[];
}

interface EmploymentHistoryFormProps {
  data: EmploymentHistoryData;
  onChange: (data: EmploymentHistoryData) => void;
}

const createEmptyEmployment = (): EmploymentEntry => ({
  id: crypto.randomUUID(),
  currentEmployment: false,
  employmentType: "",
  beginningDate: "",
  endingDate: "",
  employerName: "",
  city: "",
  state: "",
  province: "",
  country: "",
  positionDescription: ""
});

const createEmptyAffiliation = (): AffiliationEntry => ({
  id: crypto.randomUUID(),
  agencyName: "",
  agencyEin: ""
});

export default function EmploymentHistoryForm({ data, onChange }: EmploymentHistoryFormProps) {
  const updateEmployment = (index: number, field: keyof EmploymentEntry, value: string | boolean) => {
    const newEntries = [...data.employmentEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    onChange({ ...data, employmentEntries: newEntries });
  };

  const addEmployment = () => {
    onChange({
      ...data,
      employmentEntries: [...data.employmentEntries, createEmptyEmployment()]
    });
  };

  const updateAffiliation = (index: number, field: keyof AffiliationEntry, value: string) => {
    const newEntries = [...data.affiliationEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    onChange({ ...data, affiliationEntries: newEntries });
  };

  return (
    <div className="space-y-6">
      {/* Employment History Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-900 text-white px-4 py-2 text-center font-semibold">
          Employment History Information
        </div>
        <div className="p-4 space-y-6">
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p className="font-medium">Please enter information into the sections below (at least one is required).</p>
            <p>
              Account for all time for the past five years. Give all employment experience starting with your current employer working back five years. 
              Include full and part-time work, self-employment, military service, unemployment and full-time education.
            </p>
            <p>If providing current employment, please enter current month and year as the end date.</p>
          </div>

          {data.employmentEntries.map((entry, index) => (
            <div key={entry.id} className="space-y-4 pb-6 border-b last:border-b-0">
              {/* Current Employment Checkbox */}
              <div className="flex items-center justify-end gap-2">
                <Label className="text-right font-semibold">Current Employment</Label>
                <Checkbox
                  checked={entry.currentEmployment}
                  onCheckedChange={(checked) => updateEmployment(index, "currentEmployment", !!checked)}
                />
              </div>

              {/* Employment Type */}
              <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center">
                <Label className="text-right font-semibold">Employment Type</Label>
                <Select
                  value={entry.employmentType}
                  onValueChange={(value) => updateEmployment(index, "employmentType", value)}
                >
                  <SelectTrigger className="max-w-[200px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span></span>
              </div>

              {/* Beginning Date */}
              <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center">
                <Label className="text-right font-semibold">Beginning Date</Label>
                <Input
                  type="text"
                  placeholder="mm-yyyy"
                  value={entry.beginningDate}
                  onChange={(e) => updateEmployment(index, "beginningDate", e.target.value)}
                  className="max-w-[150px]"
                />
                <span className="text-destructive text-xs">* Required (mm-yyyy)</span>
              </div>

              {/* Ending Date */}
              <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center">
                <Label className="text-right font-semibold">Ending Date</Label>
                <Input
                  type="text"
                  placeholder="mm-yyyy"
                  value={entry.endingDate}
                  onChange={(e) => updateEmployment(index, "endingDate", e.target.value)}
                  className="max-w-[150px]"
                />
                <span className="text-destructive text-xs">* Required (mm-yyyy)</span>
              </div>

              {/* Employer Name */}
              <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center">
                <Label className="text-right font-semibold">Employer Name</Label>
                <Input
                  type="text"
                  value={entry.employerName}
                  onChange={(e) => updateEmployment(index, "employerName", e.target.value)}
                  className="max-w-[300px]"
                />
                <span className="text-destructive text-xs">* Required</span>
              </div>

              {/* City */}
              <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center">
                <Label className="text-right font-semibold">City</Label>
                <Input
                  type="text"
                  value={entry.city}
                  onChange={(e) => updateEmployment(index, "city", e.target.value)}
                  className="max-w-[200px]"
                />
                <span className="text-destructive text-xs">* Required</span>
              </div>

              {/* State */}
              <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center">
                <Label className="text-right font-semibold">State</Label>
                <Select
                  value={entry.state}
                  onValueChange={(value) => updateEmployment(index, "state", value)}
                >
                  <SelectTrigger className="max-w-[200px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span></span>
              </div>

              {/* Province */}
              <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center">
                <Label className="text-right font-semibold">Province</Label>
                <Select
                  value={entry.province}
                  onValueChange={(value) => updateEmployment(index, "province", value)}
                >
                  <SelectTrigger className="max-w-[200px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">N/A</SelectItem>
                  </SelectContent>
                </Select>
                <span></span>
              </div>

              {/* Country */}
              <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center">
                <Label className="text-right font-semibold">Country</Label>
                <Select
                  value={entry.country}
                  onValueChange={(value) => updateEmployment(index, "country", value)}
                >
                  <SelectTrigger className="max-w-[200px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-destructive text-xs">* Required</span>
              </div>

              {/* Position Description */}
              <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center">
                <Label className="text-right font-semibold">Position Description</Label>
                <Input
                  type="text"
                  value={entry.positionDescription}
                  onChange={(e) => updateEmployment(index, "positionDescription", e.target.value)}
                  className="max-w-[300px]"
                />
                <span className="text-destructive text-xs">* Required</span>
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={addEmployment} className="gap-2">
              <Plus className="h-4 w-4" />
              Add More Employment History Information
            </Button>
          </div>
        </div>
      </div>

      {/* Affiliation Information Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-900 text-white px-4 py-2 text-center font-semibold">
          Affiliation Information (Optional)
        </div>
        <div className="p-4 space-y-6">
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>The information in this section is optional.</p>
            <p>If you elect to provide this information, please enter all required fields.</p>
          </div>

          {data.affiliationEntries.map((entry, index) => (
            <div key={entry.id} className="space-y-4 pb-6 border-b last:border-b-0">
              {/* Agency Name */}
              <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center">
                <Label className="text-right font-semibold">Agency Name</Label>
                <Input
                  type="text"
                  value={entry.agencyName}
                  onChange={(e) => updateAffiliation(index, "agencyName", e.target.value)}
                  className="max-w-[300px]"
                />
                <span className="text-destructive text-xs">* Required</span>
              </div>

              {/* Agency EIN */}
              <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center">
                <Label className="text-right font-semibold">Agency EIN</Label>
                <Input
                  type="text"
                  value={entry.agencyEin}
                  onChange={(e) => updateAffiliation(index, "agencyEin", e.target.value)}
                  className="max-w-[150px]"
                />
                <span className="text-destructive text-xs">* Required</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { createEmptyEmployment, createEmptyAffiliation };
