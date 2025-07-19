import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { FileText, ArrowLeft, Shield, AlertTriangle } from "lucide-react";

interface TermsAcceptanceProps {
  onAccept: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function TermsAcceptance({ onAccept, onBack, isLoading }: TermsAcceptanceProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedAge, setAcceptedAge] = useState(false);

  const canProceed = acceptedTerms && acceptedPrivacy && acceptedAge;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <Card className="h-full flex flex-col">
          <CardHeader className="text-center border-b flex-shrink-0">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <FileText className="h-6 w-6" />
              Terms & Conditions
            </CardTitle>
            <p className="text-muted-foreground">
              Please read and accept our terms to complete your registration
            </p>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-hidden p-6">
            <div className="h-full flex flex-col space-y-6">
              {/* Terms and Conditions Content */}
              <div className="border rounded-lg flex-1 overflow-hidden">
                <div className="p-4 bg-muted/50 border-b flex-shrink-0">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    GameArena Terms of Service
                  </h3>
                </div>
                <ScrollArea className="h-80">
                  <div className="p-4 space-y-4 text-sm">
                    <section>
                      <h4 className="font-semibold mb-2">1. Acceptance of Terms</h4>
                      <p className="text-muted-foreground">
                        By creating an account on GameArena, you agree to be bound by these Terms of Service, 
                        our Privacy Policy, and all applicable laws and regulations. If you do not agree with 
                        any of these terms, you are prohibited from using our services.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">2. Eligibility</h4>
                      <p className="text-muted-foreground">
                        You must be at least 18 years old to use GameArena. By registering, you represent 
                        and warrant that you are of legal age to form a binding contract and are not 
                        prohibited from using our services under applicable law.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">3. Account Registration</h4>
                      <p className="text-muted-foreground">
                        You must provide accurate, current, and complete information during registration. 
                        You are responsible for maintaining the confidentiality of your account credentials 
                        and for all activities that occur under your account.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">4. Gaming Services</h4>
                      <p className="text-muted-foreground">
                        GameArena provides skill-based gaming competitions where users can participate in 
                        matches for real money prizes. All games are based on skill, not chance. We maintain 
                        strict fair play policies and use advanced verification systems.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">5. Financial Terms</h4>
                      <p className="text-muted-foreground">
                        Entry fees, deposits, and withdrawals are processed securely through our payment 
                        partners. All transactions are subject to verification. Winnings are distributed 
                        automatically upon match completion and verification.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">6. Fair Play Policy</h4>
                      <p className="text-muted-foreground">
                        We have zero tolerance for cheating, collusion, or any form of unfair play. 
                        All matches are monitored and may be live-streamed for transparency. Violations 
                        may result in account suspension and forfeiture of funds.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">7. Privacy and Data Protection</h4>
                      <p className="text-muted-foreground">
                        We collect and process your personal information in accordance with our Privacy Policy. 
                        Your data is protected using industry-standard security measures. We may use your 
                        information to improve our services and ensure platform security.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">8. Prohibited Activities</h4>
                      <p className="text-muted-foreground">
                        You may not use our platform for any illegal activities, create multiple accounts, 
                        engage in money laundering, or attempt to manipulate our systems. Violation of 
                        these terms may result in immediate account termination.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">9. Limitation of Liability</h4>
                      <p className="text-muted-foreground">
                        GameArena's liability is limited to the maximum extent permitted by law. We are 
                        not responsible for any indirect, incidental, or consequential damages arising 
                        from your use of our services.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">10. Governing Law</h4>
                      <p className="text-muted-foreground">
                        These terms are governed by the laws of India. Any disputes will be resolved 
                        through binding arbitration in accordance with Indian arbitration laws.
                      </p>
                    </section>

                    <section>
                      <h4 className="font-semibold mb-2">11. Contact Information</h4>
                      <p className="text-muted-foreground">
                        For any questions regarding these terms, please contact us at legal@gamearena.com 
                        or through our support system. We are committed to addressing your concerns promptly.
                      </p>
                    </section>
                  </div>
                </ScrollArea>
              </div>

              {/* Age Verification Warning */}
              <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex-shrink-0">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                      Age Verification Required
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      You must be 18 years or older to participate in real money gaming. 
                      False age declaration may result in account termination and fund forfeiture.
                    </p>
                  </div>
                </div>
              </div>

              {/* Acceptance Checkboxes */}
              <div className="space-y-4 flex-shrink-0">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I have read and agree to the{" "}
                    <span className="font-semibold text-primary">Terms of Service</span> and understand 
                    that GameArena is a skill-based gaming platform for users 18 years and older.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={acceptedPrivacy}
                    onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                    className="mt-1"
                  />
                  <label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the{" "}
                    <span className="font-semibold text-primary">Privacy Policy</span> and consent 
                    to the collection and processing of my personal data as described.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="age"
                    checked={acceptedAge}
                    onCheckedChange={(checked) => setAcceptedAge(checked as boolean)}
                    className="mt-1"
                  />
                  <label htmlFor="age" className="text-sm leading-relaxed cursor-pointer">
                    I confirm that I am{" "}
                    <span className="font-semibold text-primary">18 years or older</span> and 
                    legally eligible to participate in real money skill-based gaming in my jurisdiction.
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={onAccept}
                  disabled={!canProceed || isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Creating Account..." : "Accept & Create Account"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}