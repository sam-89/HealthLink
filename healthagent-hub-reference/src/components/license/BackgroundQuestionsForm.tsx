import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

export interface BackgroundAnswer {
  answer: "yes" | "no" | "";
  explanation: string;
}

export interface BackgroundQuestionsData {
  criminalConviction: BackgroundAnswer;
  pendingCharges: BackgroundAnswer;
  administrativeAction: BackgroundAnswer;
  licenseRevoked: BackgroundAnswer;
  civilJudgment: BackgroundAnswer;
  bankruptcy: BackgroundAnswer;
  enoInsurance: {
    hasInsurance: "yes" | "no" | "";
    carrierName: string;
    policyNumber: string;
    expirationDate: string;
    coverageAmount: string;
  };
}

export const createEmptyBackgroundData = (): BackgroundQuestionsData => ({
  criminalConviction: { answer: "", explanation: "" },
  pendingCharges: { answer: "", explanation: "" },
  administrativeAction: { answer: "", explanation: "" },
  licenseRevoked: { answer: "", explanation: "" },
  civilJudgment: { answer: "", explanation: "" },
  bankruptcy: { answer: "", explanation: "" },
  enoInsurance: {
    hasInsurance: "",
    carrierName: "",
    policyNumber: "",
    expirationDate: "",
    coverageAmount: ""
  }
});

interface BackgroundQuestionsFormProps {
  data: BackgroundQuestionsData;
  onChange: (data: BackgroundQuestionsData) => void;
}

const BACKGROUND_QUESTIONS = [
  {
    id: "criminalConviction",
    question: "Have you ever been convicted of, pled guilty or nolo contendere to, or are you currently charged with committing a crime (felony or misdemeanor)?",
    note: "You may exclude minor traffic violations but must include any alcohol and/or drug-related violations."
  },
  {
    id: "pendingCharges",
    question: "Are there any criminal charges pending against you in any jurisdiction?",
    note: "Include any charges that have not yet been resolved, regardless of anticipated outcome."
  },
  {
    id: "administrativeAction",
    question: "Have you ever had any professional license, permit, or certificate denied, suspended, revoked, cancelled, or subjected to any other disciplinary action by any regulatory authority?",
    note: "Include any action taken against any type of professional license in any state or jurisdiction."
  },
  {
    id: "licenseRevoked",
    question: "Have you ever had an insurance license or any other professional or occupational license denied, suspended, revoked, or refused renewal?",
    note: "This includes voluntary surrender of a license in lieu of disciplinary action."
  },
  {
    id: "civilJudgment",
    question: "Have you ever had a civil judgment or an administrative order entered against you relating to fraud, misrepresentation, or breach of fiduciary duty?",
    note: "Include judgments that have been satisfied or discharged."
  },
  {
    id: "bankruptcy",
    question: "Have you ever filed for bankruptcy or had a bankruptcy petition filed against you within the past 10 years?",
    note: "Include all chapters of bankruptcy (7, 11, 13, etc.) whether discharged or dismissed."
  }
];

const BackgroundQuestionsForm = ({ data, onChange }: BackgroundQuestionsFormProps) => {
  const handleAnswerChange = (questionId: keyof Omit<BackgroundQuestionsData, 'enoInsurance'>, answer: "yes" | "no") => {
    onChange({
      ...data,
      [questionId]: {
        ...data[questionId],
        answer,
        explanation: answer === "no" ? "" : data[questionId].explanation
      }
    });
  };

  const handleExplanationChange = (questionId: keyof Omit<BackgroundQuestionsData, 'enoInsurance'>, explanation: string) => {
    onChange({
      ...data,
      [questionId]: {
        ...data[questionId],
        explanation
      }
    });
  };

  const handleEnoChange = (field: keyof BackgroundQuestionsData['enoInsurance'], value: string) => {
    onChange({
      ...data,
      enoInsurance: {
        ...data.enoInsurance,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-3 text-center font-semibold">
        Background Questions
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-semibold mb-1">Important Notice</p>
            <p>
              You must answer all questions truthfully and completely. A "Yes" answer does not automatically disqualify you 
              from licensure. Each case is reviewed individually. Failure to disclose required information may result in 
              denial of your application or revocation of your license.
            </p>
          </div>
        </div>
      </div>

      {/* Background Questions */}
      <div className="p-6 space-y-6">
        <p className="text-sm text-muted-foreground">
          Please answer the following questions. If you answer "Yes" to any question, you must provide a detailed explanation.
        </p>

        {BACKGROUND_QUESTIONS.map((q, index) => {
          const questionKey = q.id as keyof Omit<BackgroundQuestionsData, 'enoInsurance'>;
          const answerData = data[questionKey];
          
          return (
            <div key={q.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex gap-3">
                <span className="font-semibold text-primary shrink-0">{index + 1}.</span>
                <div className="space-y-2 flex-1">
                  <p className="font-medium text-foreground">{q.question}</p>
                  <p className="text-xs text-muted-foreground italic">{q.note}</p>
                  
                  <RadioGroup
                    value={answerData.answer}
                    onValueChange={(value) => handleAnswerChange(questionKey, value as "yes" | "no")}
                    className="flex gap-6 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`${q.id}-yes`} />
                      <Label htmlFor={`${q.id}-yes`} className="cursor-pointer text-foreground">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`${q.id}-no`} />
                      <Label htmlFor={`${q.id}-no`} className="cursor-pointer text-foreground">No</Label>
                    </div>
                  </RadioGroup>

                  {answerData.answer === "yes" && (
                    <div className="pt-2">
                      <Label htmlFor={`${q.id}-explanation`} className="text-sm font-medium">
                        Please provide a detailed explanation <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id={`${q.id}-explanation`}
                        placeholder="Provide complete details including dates, locations, case numbers, and final disposition..."
                        value={answerData.explanation}
                        onChange={(e) => handleExplanationChange(questionKey, e.target.value)}
                        className="mt-1 min-h-[100px]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* E&O Insurance Section */}
      <div className="border-t">
        <div className="bg-gray-900 text-white px-4 py-3 text-center font-semibold">
          Errors & Omissions (E&O) Insurance Information
        </div>
        
        <div className="p-6 space-y-6">
          <p className="text-sm text-muted-foreground">
            Some states require proof of Errors & Omissions (E&O) insurance coverage. Please indicate if you currently have E&O insurance.
          </p>

          <div className="border rounded-lg p-4 space-y-4">
            <div className="space-y-3">
              <Label className="font-medium">Do you currently have Errors & Omissions insurance coverage?</Label>
              <RadioGroup
                value={data.enoInsurance.hasInsurance}
                onValueChange={(value) => handleEnoChange("hasInsurance", value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="eno-yes" />
                  <Label htmlFor="eno-yes" className="cursor-pointer text-foreground">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="eno-no" />
                  <Label htmlFor="eno-no" className="cursor-pointer text-foreground">No</Label>
                </div>
              </RadioGroup>
            </div>

            {data.enoInsurance.hasInsurance === "yes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-2">
                  <Label htmlFor="eno-carrier">Insurance Carrier Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="eno-carrier"
                    placeholder="Enter carrier name"
                    value={data.enoInsurance.carrierName}
                    onChange={(e) => handleEnoChange("carrierName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eno-policy">Policy Number <span className="text-destructive">*</span></Label>
                  <Input
                    id="eno-policy"
                    placeholder="Enter policy number"
                    value={data.enoInsurance.policyNumber}
                    onChange={(e) => handleEnoChange("policyNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eno-expiration">Policy Expiration Date <span className="text-destructive">*</span></Label>
                  <Input
                    id="eno-expiration"
                    type="date"
                    value={data.enoInsurance.expirationDate}
                    onChange={(e) => handleEnoChange("expirationDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eno-coverage">Coverage Amount <span className="text-destructive">*</span></Label>
                  <Input
                    id="eno-coverage"
                    placeholder="e.g., $1,000,000"
                    value={data.enoInsurance.coverageAmount}
                    onChange={(e) => handleEnoChange("coverageAmount", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundQuestionsForm;
