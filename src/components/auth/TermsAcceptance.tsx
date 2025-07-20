import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { FileText, AlertTriangle, ArrowLeft } from "lucide-react";

interface TermsAcceptanceProps {
  onAccept: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function TermsAcceptance({ onAccept, onBack, isLoading = false }: TermsAcceptanceProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [confirmedAge, setConfirmedAge] = useState(false);

  const canProceed = acceptedTerms && acceptedPrivacy && confirmedAge;

  const handleCheckboxChange = (setter: (value: boolean) => void) => (checked: any) => {
    setter(checked === true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-4 flex-shrink-0">
          <div className="flex items-center justify-center mb-3">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-bold">Terms & Conditions</h2>
          <p className="text-sm text-muted-foreground">
            Please read and accept our terms to complete registration
          </p>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-[200px] border rounded-lg p-4 mb-4">
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">1. Acceptance of Terms</h4>
                <p className="text-muted-foreground">
                  By creating an account and using Clutch Pays, you agree to be bound by these Terms of Service.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">2. Eligibility</h4>
                <p className="text-muted-foreground">
                  You must be at least 18 years old to participate in real money gaming.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">3. Fair Play Policy</h4>
                <p className="text-muted-foreground">
                  All matches are skill-based and must be played fairly. Cheating will result in account termination.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">4. Financial Terms</h4>
                <p className="text-muted-foreground">
                  All transactions are processed securely. Platform fees may apply.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">5. Responsible Gaming</h4>
                <p className="text-muted-foreground">
                  We promote responsible gaming. Set limits and seek help if needed.
                </p>
              </div>
            </div>
          </ScrollArea>

          {/* Age Warning */}
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-orange-800 dark:text-orange-200 text-sm">
                  Age Verification Required
                </h4>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  You must be 18+ to participate. False declaration may result in account termination.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Section */}
        <div className="flex-shrink-0 space-y-3 pt-4 border-t">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={handleCheckboxChange(setAcceptedTerms)}
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-xs leading-relaxed cursor-pointer">
                I agree to the <span className="font-medium">Terms of Service</span>
              </label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacy"
                checked={acceptedPrivacy}
                onCheckedChange={handleCheckboxChange(setAcceptedPrivacy)}
                disabled={isLoading}
              />
              <label htmlFor="privacy" className="text-xs leading-relaxed cursor-pointer">
                I agree to the <span className="font-medium">Privacy Policy</span>
              </label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="age"
                checked={confirmedAge}
                onCheckedChange={handleCheckboxChange(setConfirmedAge)}
                disabled={isLoading}
              />
              <label htmlFor="age" className="text-xs leading-relaxed cursor-pointer">
                I confirm I am <span className="font-medium">18+ years old</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isLoading}
              className="flex-1"
              size="sm"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back
            </Button>
            <Button
              onClick={onAccept}
              disabled={!canProceed || isLoading}
              className="flex-1"
              size="sm"
            >
              {isLoading ? "Creating..." : "Accept & Continue"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}