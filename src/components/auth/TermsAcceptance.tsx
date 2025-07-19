import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { FileText, ArrowLeft, AlertTriangle } from "lucide-react";

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

  const handleAccept = () => {
    if (canProceed && !isLoading) {
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl max-h-[95vh] flex flex-col"
      >
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-shrink-0 text-center">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Terms & Conditions</CardTitle>
            <p className="text-muted-foreground">
              Please read and accept our terms to complete your registration
            </p>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col min-h-0 space-y-4">
            {/* Scrollable Terms Content */}
            <div className="flex-1 min-h-0">
              <div className="border rounded-lg p-4 h-48">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-base mb-2">GameArena Terms of Service</h4>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-1">1. Acceptance of Terms</h5>
                      <p className="text-muted-foreground">
                        By creating an account and using GameArena, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">2. Eligibility</h5>
                      <p className="text-muted-foreground">
                        You must be at least 18 years old to participate in real money gaming on our platform. Age verification may be required.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">3. Account Registration</h5>
                      <p className="text-muted-foreground">
                        You must provide accurate, current, and complete information during registration. You are responsible for maintaining account security.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">4. Gaming Services</h5>
                      <p className="text-muted-foreground">
                        GameArena provides skill-based gaming matches where players compete for real money prizes. All games are based on skill, not chance.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">5. Financial Terms</h5>
                      <p className="text-muted-foreground">
                        Entry fees range from ₹10 to ₹10,000. Winners receive 90% of the total prize pool, with 10% retained as platform fee.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">6. Fair Play Policy</h5>
                      <p className="text-muted-foreground">
                        All matches are live-streamed for transparency. Cheating, collusion, or unfair practices result in immediate account termination.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">7. Privacy and Data Protection</h5>
                      <p className="text-muted-foreground">
                        We collect and process personal data in accordance with our Privacy Policy. Your data is protected and never sold to third parties.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">8. Prohibited Activities</h5>
                      <p className="text-muted-foreground">
                        Users may not engage in fraud, money laundering, account sharing, or any illegal activities on the platform.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">9. Limitation of Liability</h5>
                      <p className="text-muted-foreground">
                        GameArena's liability is limited to the amount in your account balance. We are not liable for indirect or consequential damages.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">10. Governing Law</h5>
                      <p className="text-muted-foreground">
                        These terms are governed by Indian law. Disputes will be resolved through arbitration in Gurgaon, Haryana.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">11. Contact Information</h5>
                      <p className="text-muted-foreground">
                        For support, contact us at support@gamearena.com or call +91-124-4567890. Our office is located in Gurgaon, Haryana.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">12. User Conduct</h5>
                      <p className="text-muted-foreground">
                        Users must maintain respectful behavior, follow community guidelines, and report any suspicious activities.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">13. Intellectual Property</h5>
                      <p className="text-muted-foreground">
                        All platform content, including logos, designs, and software, is owned by GameArena and protected by copyright laws.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">14. Service Availability</h5>
                      <p className="text-muted-foreground">
                        We strive to maintain 24/7 service availability but cannot guarantee uninterrupted access. Scheduled maintenance will be announced in advance.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">15. Modifications to Terms</h5>
                      <p className="text-muted-foreground">
                        We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notifications.
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Age Verification Warning */}
            <div className="flex-shrink-0 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-200">Age Verification Required</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    You must be 18 years or older to participate in real money gaming. False age declaration may result in account termination and fund forfeiture.
                  </p>
                </div>
              </div>
            </div>

            {/* Acceptance Checkboxes */}
            <div className="flex-shrink-0 space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  disabled={isLoading}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  I have read and agree to the <span className="font-medium">Terms of Service</span> and understand that GameArena is a skill-based gaming platform for users 18 years and older.
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                  disabled={isLoading}
                  className="mt-1"
                />
                <label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                  I agree to the <span className="font-medium">Privacy Policy</span> and consent to the collection and processing of my personal data as described.
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="age"
                  checked={confirmedAge}
                  onCheckedChange={(checked) => setConfirmedAge(checked as boolean)}
                  disabled={isLoading}
                  className="mt-1"
                />
                <label htmlFor="age" className="text-sm leading-relaxed cursor-pointer">
                  I confirm that I am <span className="font-medium">18 years or older</span> and legally eligible to participate in real money skill-based gaming in my jurisdiction.
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onBack}
                disabled={isLoading}
                className="flex-1 h-9"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleAccept}
                disabled={!canProceed || isLoading}
                className="flex-1 h-9"
              >
                {isLoading ? "Creating Account..." : "Accept & Create Account"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}