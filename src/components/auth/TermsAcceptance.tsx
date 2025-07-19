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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="max-h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0 text-center border-b">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Terms & Conditions</CardTitle>
          <p className="text-muted-foreground">
            Please read and accept our terms to complete your registration
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-[50vh] px-6 py-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Clutch Pays Terms of Service</h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">1. Acceptance of Terms</h4>
                    <p className="text-muted-foreground">
                      By creating an account and using Clutch Pays, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">2. Eligibility</h4>
                    <p className="text-muted-foreground">
                      You must be at least 18 years old to participate in real money gaming. Users under 18 are strictly prohibited from using our platform.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">3. Account Responsibility</h4>
                    <p className="text-muted-foreground">
                      You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">4. Fair Play Policy</h4>
                    <p className="text-muted-foreground">
                      All matches are skill-based and must be played fairly. Any form of cheating, collusion, or unfair advantage will result in immediate account termination.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">5. Financial Terms</h4>
                    <p className="text-muted-foreground">
                      All transactions are processed securely. Deposits and withdrawals are subject to verification. Platform fees may apply to certain transactions.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">6. Dispute Resolution</h4>
                    <p className="text-muted-foreground">
                      All match disputes will be reviewed by our support team. Live streams and match recordings may be used as evidence in dispute resolution.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">7. Responsible Gaming</h4>
                    <p className="text-muted-foreground">
                      We promote responsible gaming. Set limits for yourself and seek help if gaming becomes problematic. We reserve the right to limit or suspend accounts showing signs of problem gambling.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">8. Privacy & Data Protection</h4>
                    <p className="text-muted-foreground">
                      Your personal information is protected according to our Privacy Policy. We collect and process data necessary for platform operation and legal compliance.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">9. Platform Availability</h4>
                    <p className="text-muted-foreground">
                      We strive for 99.9% uptime but cannot guarantee uninterrupted service. Scheduled maintenance will be announced in advance.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">10. Termination</h4>
                    <p className="text-muted-foreground">
                      We reserve the right to terminate accounts that violate these terms. Upon termination, remaining wallet balance will be processed according to our refund policy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                      Age Verification Required
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      You must be 18 years or older to participate in real money gaming. 
                      False age declaration may result in account termination and fund forfeiture.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="border-t p-6 space-y-4 flex-shrink-0">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={setAcceptedTerms}
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  I have read and agree to the <span className="font-medium">Terms of Service</span> and understand 
                  that Clutch Pays is a skill-based gaming platform for users 18 years and older.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={setAcceptedPrivacy}
                  disabled={isLoading}
                />
                <label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                  I agree to the <span className="font-medium">Privacy Policy</span> and consent to the collection and 
                  processing of my personal data as described.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="age"
                  checked={confirmedAge}
                  onCheckedChange={setConfirmedAge}
                  disabled={isLoading}
                />
                <label htmlFor="age" className="text-sm leading-relaxed cursor-pointer">
                  I confirm that I am <span className="font-medium">18 years or older</span> and legally eligible to 
                  participate in real money skill-based gaming in my jurisdiction.
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onBack}
                disabled={isLoading}
                className="flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Form
              </Button>
              <Button
                onClick={onAccept}
                disabled={!canProceed || isLoading}
                className="flex-1"
              >
                {isLoading ? "Creating Account..." : "Accept & Continue"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}