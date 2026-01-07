import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ApplyLicensePage = () => {
  const navigate = useNavigate();
  const [insuranceExpanded, setInsuranceExpanded] = useState(false);
  const [adjusterExpanded, setAdjusterExpanded] = useState(false);
  const [residencyType, setResidencyType] = useState<string>("");
  const [entityType, setEntityType] = useState<string>("");
  const [adjusterResidencyType, setAdjusterResidencyType] = useState<string>("");
  const [adjusterEntityType, setAdjusterEntityType] = useState<string>("");

  const handleInsuranceContinue = () => {
    if (residencyType && entityType) {
      navigate(`/agent/services/licensing/new-insurance?residency=${residencyType}&entity=${entityType}`);
    }
  };

  const handleAdjusterContinue = () => {
    if (adjusterResidencyType && adjusterEntityType) {
      navigate(`/agent/services/licensing/new-adjuster?residency=${adjusterResidencyType}&entity=${adjusterEntityType}`);
    }
  };

  const handleInsuranceCancel = () => {
    setInsuranceExpanded(false);
    setResidencyType("");
    setEntityType("");
  };

  const handleAdjusterCancel = () => {
    setAdjusterExpanded(false);
    setAdjusterResidencyType("");
    setAdjusterEntityType("");
  };

  return (
    <div className="space-y-6">
      {/* Exit Link */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Exit
      </button>

      {/* Info Alert */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-foreground">
          If you have recently submitted an address change request to your resident state, please allow 5 to 7 business days for processing before submitting a new or updated license application.
        </AlertDescription>
      </Alert>

      {/* Renew Link */}
      <div className="text-right">
        <Button variant="link" className="text-primary" onClick={() => navigate("/agent/services/licensing/renew")}>
          Renew an Existing License
        </Button>
      </div>

      {/* License Sections */}
      <div className="space-y-4">
        {/* New Insurance Licenses */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-900 text-white px-4 py-3 font-semibold">
            NEW INSURANCE LICENSES
          </div>
          <div className="p-4 space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
              <p className="text-sm text-muted-foreground">
                Start an application for a <span className="font-semibold text-foreground">new license</span> or{" "}
                <span className="font-semibold text-foreground">add new lines of authority</span> to an existing license
              </p>
              <Button 
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 shrink-0 w-48 justify-center"
                onClick={() => setInsuranceExpanded(!insuranceExpanded)}
              >
                New Insurance License
              </Button>
            </div>

            {/* Expandable Options */}
            {insuranceExpanded && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                {/* Residency Type */}
                <RadioGroup value={residencyType} onValueChange={setResidencyType}>
                  <div className="grid grid-cols-[1fr_120px_120px] items-center border-t py-3">
                    <Label className="text-sm text-muted-foreground">
                      Is this a Resident or Non-Resident license?
                    </Label>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="resident" 
                        id="resident" 
                        className="border-orange-500 text-orange-500"
                      />
                      <Label htmlFor="resident" className="font-normal cursor-pointer text-sm">Resident</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="non-resident" 
                        id="non-resident"
                        className="border-orange-500 text-orange-500"
                      />
                      <Label htmlFor="non-resident" className="font-normal cursor-pointer text-sm">Non-Resident</Label>
                    </div>
                  </div>
                </RadioGroup>

                {/* Entity Type */}
                <RadioGroup value={entityType} onValueChange={setEntityType}>
                  <div className="grid grid-cols-[1fr_120px_120px] items-center border-t py-3">
                    <Label className="text-sm text-muted-foreground">
                      Are you an individual or a firm?
                    </Label>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="individual" 
                        id="individual"
                        className="border-orange-500 text-orange-500"
                      />
                      <Label htmlFor="individual" className="font-normal cursor-pointer text-sm">Individual</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="firm" 
                        id="firm"
                        className="border-orange-500 text-orange-500"
                      />
                      <Label htmlFor="firm" className="font-normal cursor-pointer text-sm">Firm</Label>
                    </div>
                  </div>
                </RadioGroup>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="link" className="text-orange-500" onClick={handleInsuranceCancel}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gray-400 hover:bg-gray-500 text-white disabled:bg-gray-300"
                    disabled={!residencyType || !entityType}
                    onClick={handleInsuranceContinue}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Adjuster Licenses */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-900 text-white px-4 py-3 font-semibold">
            NEW ADJUSTER LICENSES
          </div>
          <div className="p-4 space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
              <p className="text-sm text-muted-foreground">
                Start an application for a <span className="font-semibold text-foreground">new adjuster license</span> or{" "}
                <span className="font-semibold text-foreground">add new lines of authority</span> to an existing license
              </p>
              <Button 
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 shrink-0 w-48 justify-center"
                onClick={() => setAdjusterExpanded(!adjusterExpanded)}
              >
                New Adjuster License
              </Button>
            </div>

            {/* Expandable Options */}
            {adjusterExpanded && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                {/* Residency Type */}
                <RadioGroup value={adjusterResidencyType} onValueChange={setAdjusterResidencyType}>
                  <div className="grid grid-cols-[1fr_120px_120px] items-center border-t py-3">
                    <Label className="text-sm text-muted-foreground">
                      Is this a Resident or Non-Resident license?
                    </Label>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="resident" 
                        id="adj-resident"
                        className="border-orange-500 text-orange-500"
                      />
                      <Label htmlFor="adj-resident" className="font-normal cursor-pointer text-sm">Resident</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="non-resident" 
                        id="adj-non-resident"
                        className="border-orange-500 text-orange-500"
                      />
                      <Label htmlFor="adj-non-resident" className="font-normal cursor-pointer text-sm">Non-Resident</Label>
                    </div>
                  </div>
                </RadioGroup>

                {/* Entity Type */}
                <RadioGroup value={adjusterEntityType} onValueChange={setAdjusterEntityType}>
                  <div className="grid grid-cols-[1fr_120px_120px] items-center border-t py-3">
                    <Label className="text-sm text-muted-foreground">
                      Are you an individual or a firm?
                    </Label>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="individual" 
                        id="adj-individual"
                        className="border-orange-500 text-orange-500"
                      />
                      <Label htmlFor="adj-individual" className="font-normal cursor-pointer text-sm">Individual</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="firm" 
                        id="adj-firm"
                        className="border-orange-500 text-orange-500"
                      />
                      <Label htmlFor="adj-firm" className="font-normal cursor-pointer text-sm">Firm</Label>
                    </div>
                  </div>
                </RadioGroup>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="link" className="text-orange-500" onClick={handleAdjusterCancel}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gray-400 hover:bg-gray-500 text-white disabled:bg-gray-300"
                    disabled={!adjusterResidencyType || !adjusterEntityType}
                    onClick={handleAdjusterContinue}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Other Licenses */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-900 text-white px-4 py-3 font-semibold">
            OTHER INSURANCE & NON-INSURANCE LICENSES
          </div>
          <div className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Don't see your license type above? Start an application for other licenses not included above, such as certain insurance-related licenses or licenses for other industries{" "}
                <span className="font-semibold text-foreground">(e.g., Fire, Abstracters, Athlete Agents, etc.)</span>
              </p>
              <Button 
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 shrink-0 w-48 justify-center"
                onClick={() => navigate("/agent/services/licensing/other")}
              >
                Other Licenses
              </Button>
            </div>
            <p className="text-xs text-muted-foreground italic text-right">
              You'll be able to select a license type on following screens
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLicensePage;
