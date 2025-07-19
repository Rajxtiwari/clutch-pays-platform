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
        className="w-full max-w-4xl max-h-[95vh] flex flex-col"
      >
        <Card className="h-full flex flex-col max-h-[95vh]">
          <CardHeader className="text-center border-b flex-shrink-0 py-3">
            <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
              <FileText className="h-5 w-5" />
              Terms & Conditions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Please read and accept our terms to complete your registration
            </p>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-4 overflow-hidden min-h-0">
            {/* Scrollable Terms Content */}
            <div className="border rounded-lg mb-4 flex-shrink-0" style={{ height: '200px' }}>
              <div className="p-3 bg-muted/50 border-b flex-shrink-0">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4" />
                  GameArena Terms of Service
                </h3>
              </div>
              <ScrollArea className="h-40 p-3">
                <div className="space-y-3 text-xs pr-3">
                  <section>
                    <h4 className="font-semibold mb-1">1. Acceptance of Terms</h4>
                    <p className="text-muted-foreground mb-2">
                      By creating an account on GameArena, you agree to be bound by these Terms of Service, 
                      our Privacy Policy, and all applicable laws and regulations.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-1">2. Eligibility</h4>
                    <p className="text-muted-foreground mb-2">
                      You must be at least 18 years old to use GameArena. By registering, you represent 
                      and warrant that you are of legal age to form a binding contract.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-1">3. Account Registration</h4>
                    <p className="text-muted-foreground mb-2">
                      You must provide accurate, current, and complete information during registration. 
                      You are responsible for maintaining the confidentiality of your account credentials.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-1">4. Gaming Services</h4>
                    <p className="text-muted-foreground mb-2">
                      GameArena provides skill-based gaming competitions where users can participate in 
                      matches for real money prizes. All games are based on skill, not chance.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-1">5. Financial Terms</h4>
                    <p className="text-muted-foreground mb-2">
                      Entry fees, deposits, and withdrawals are processed securely through our payment 
                      partners. All transactions are subject to verification.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-1">6. Fair Play Policy</h4>
                    <p className="text-muted-foreground mb-2">
                      We have zero tolerance for cheating, collusion, or any form of unfair play. 
                      All matches are monitored and may be live-streamed for transparency.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-1">7. Privacy and Data Protection</h4>
                    <p className="text-muted-foreground mb-2">
                      We collect and process your personal information in accordance with our Privacy Policy. 
                      Your data is protected using industry-standard security measures.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-1">8. Prohibited Activities</h4>
                    <p className="text-muted-foreground mb-2">
                      You may not use our platform for any illegal activities, create multiple accounts, 
                      engage in money laundering, or attempt to manipulate our systems.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-1">9. Limitation of Liability</h4>
                    <p className="text-muted-foreground mb-2">
                      GameArena's liability is limited to the maximum extent permitted by law. We are 
                      not responsible for any indirect, incidental, or consequential damages.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-1">10. Governing Law</h4>
                    <p className="text-muted-foreground mb-2">
                      These terms are governed by the laws of India. Any disputes will be resolved 
                      through binding arbitration in accordance with Indian arbitration laws.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-1">11. Contact Information</h4>
                    <p className="text-muted-foreground mb-2">
                      For any questions regarding these terms, please contact us at legal@gamearena.com 
                      or through our support system.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-1">12. User Conduct</h4>
                    <p className="text-muted-foreground mb-2">
                      Users must maintain respectful behavior towards other players and staff. Harassment, 
                      abuse, or inappropriate conduct will result in account suspension.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-1">13. Service Availability</h4>
                    <p className="text-muted-foreground mb-2">
                      We strive to maintain 24/7 service availability but cannot guarantee uninterrupted 
                      access. Scheduled maintenance will be announced in advance.
                    </p>
                  </section>

                  <section>
                    <h4 className="font-semibold mb-1">14. Modifications to Terms</h4>
                    <p className="text-muted-foreground mb-2">
                      We reserve the right to modify these terms at any time. Users will be notified of 
                      significant changes via email or platform notifications.
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </div>

            {/* Age Verification Warning */}
            <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4 flex-shrink-0">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 text-sm">
                    Age Verification Required
                  </h4>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    You must be 18 years or older to participate in real money gaming. 
                    False age declaration may result in account termination and fund forfeiture.
                  </p>
                </div>
              </div>
            </div>

            {/* Acceptance Checkboxes */}
            <div className="space-y-2 mb-4 flex-shrink-0">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  className="mt-0.5"
                />
                <label htmlFor="terms" className="text-xs leading-relaxed cursor-pointer">
                  I have read and agree to the{" "}
                  <span className="font-semibold text-primary">Terms of Service</span> and understand 
                  that GameArena is a skill-based gaming platform for users 18 years and older.
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                  className="mt-0.5"
                />
                <label htmlFor="privacy" className="text-xs leading-relaxed cursor-pointer">
                  I agree to the{" "}
                  <span className="font-semibold text-primary">Privacy Policy</span> and consent 
                  to the collection and processing of my personal data as described.
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="age"
                  checked={acceptedAge}
                  onCheckedChange={(checked) => setAcceptedAge(checked as boolean)}
                  className="mt-0.5"
                />
                <label htmlFor="age" className="text-xs leading-relaxed cursor-pointer">
                  I confirm that I am{" "}
                  <span className="font-semibold text-primary">18 years or older</span> and 
                  legally eligible to participate in real money skill-based gaming in my jurisdiction.
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 h-9 text-sm"
                disabled={isLoading}
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
              <Button
                onClick={onAccept}
                disabled={!canProceed || isLoading}
                className="flex-1 h-9 text-sm"
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