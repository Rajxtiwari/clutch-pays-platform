import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">G</span>
            </div>
            <span className="font-bold text-xl">GameArena</span>
          </div>
        </div>
      </header>

      <div className="container px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-6">Terms & Conditions</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  By accessing and using GameArena ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These Terms and Conditions govern your use of our skill-based gaming platform, including all games, tournaments, 
                  financial transactions, and related services provided by GameArena Technologies Pvt. Ltd.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Eligibility and Account Registration</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4>2.1 Age Requirements</h4>
                <p>You must be at least 18 years old to use our platform. By registering, you confirm that you meet this age requirement.</p>
                
                <h4>2.2 Account Verification</h4>
                <p>Users must complete our multi-level verification process:</p>
                <ul>
                  <li><strong>Email Verification:</strong> Confirm your email address</li>
                  <li><strong>Player Verification:</strong> Provide basic personal information</li>
                  <li><strong>Host Verification:</strong> Additional KYC documentation for hosting matches</li>
                </ul>
                
                <h4>2.3 Account Security</h4>
                <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Gaming Services and Fair Play</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4>3.1 Skill-Based Gaming</h4>
                <p>
                  GameArena provides a platform for skill-based competitive gaming. All games require skill, strategy, and knowledge rather than chance.
                </p>
                
                <h4>3.2 Fair Play Policy</h4>
                <ul>
                  <li>Use of cheats, hacks, or unauthorized software is strictly prohibited</li>
                  <li>Account sharing or boosting services are not allowed</li>
                  <li>All matches must be played fairly and in good sportsmanship</li>
                  <li>Live streaming requirements ensure transparency and fair play</li>
                </ul>
                
                <h4>3.3 Match Disputes</h4>
                <p>
                  In case of disputes, our admin team will review match footage and make final decisions. 
                  Users can appeal decisions within 24 hours of the ruling.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Financial Terms and Transactions</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4>4.1 Wallet System</h4>
                <p>
                  All financial transactions are processed through our secure wallet system. 
                  Users must maintain sufficient balance to participate in paid matches.
                </p>
                
                <h4>4.2 Deposits and Withdrawals</h4>
                <ul>
                  <li><strong>Minimum Deposit:</strong> ₹10</li>
                  <li><strong>Maximum Deposit:</strong> ₹1,00,000 per transaction</li>
                  <li><strong>Minimum Withdrawal:</strong> ₹100</li>
                  <li><strong>Processing Time:</strong> 1-3 business days for withdrawals</li>
                </ul>
                
                <h4>4.3 Entry Fees and Winnings</h4>
                <p>
                  Entry fees are deducted upon joining a match. Winnings are credited automatically upon match completion. 
                  Platform fees may apply as disclosed during match registration.
                </p>
                
                <h4>4.4 Pricing Structure</h4>
                <p>All pricing on our platform is displayed in Indian Rupees (INR). Entry fees vary by match type and are clearly displayed before joining.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. User Conduct and Prohibited Activities</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4>5.1 Acceptable Use</h4>
                <p>Users must conduct themselves professionally and respectfully at all times on the platform.</p>
                
                <h4>5.2 Prohibited Activities</h4>
                <ul>
                  <li>Harassment, abuse, or threatening behavior toward other users</li>
                  <li>Attempting to manipulate match outcomes</li>
                  <li>Creating multiple accounts to gain unfair advantages</li>
                  <li>Sharing inappropriate content or spam</li>
                  <li>Attempting to circumvent platform security measures</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Privacy and Data Protection</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Your privacy is important to us. We collect and process personal information in accordance with our Privacy Policy. 
                  By using our platform, you consent to our data collection and processing practices as outlined in our Privacy Policy.
                </p>
                <p>
                  We implement industry-standard security measures to protect your personal and financial information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Platform Availability and Modifications</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. 
                  We reserve the right to modify, suspend, or discontinue any part of our service with reasonable notice.
                </p>
                <p>
                  These Terms and Conditions may be updated periodically. Users will be notified of significant changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  GameArena Technologies Pvt. Ltd. shall not be liable for any indirect, incidental, special, or consequential damages 
                  arising from your use of the platform. Our total liability shall not exceed the amount you have paid to us in the 
                  preceding 12 months.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Governing Law and Jurisdiction</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms shall be 
                  subject to the exclusive jurisdiction of the courts in Gurgaon, Haryana, India.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  For questions about these Terms and Conditions, please contact us at:
                </p>
                <p>
                  <strong>Email:</strong> legal@gamearena.com<br />
                  <strong>Phone:</strong> +91 98765 43210<br />
                  <strong>Address:</strong> GameArena Technologies Pvt. Ltd., 123 Tech Park, Sector 5, Gurgaon, Haryana 122001, India
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
