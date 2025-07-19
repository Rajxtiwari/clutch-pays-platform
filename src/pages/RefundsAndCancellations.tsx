import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";

export default function RefundsAndCancellations() {
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
          <h1 className="text-4xl font-bold tracking-tight mb-6">Refunds & Cancellations Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          <div className="space-y-8">
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <AlertTriangle className="h-5 w-5" />
                  Important Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 dark:text-blue-300">
                  This policy outlines the terms and conditions for refunds and cancellations on the GameArena platform. 
                  Please read carefully before participating in any matches or making deposits.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>1. Match Entry Fee Refunds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-700 dark:text-green-300">Full Refund</h4>
                    </div>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Match cancelled by host</li>
                      <li>• Technical issues prevent match</li>
                      <li>• Insufficient players to start</li>
                      <li>• Platform maintenance</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">Partial Refund</h4>
                    </div>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• Cancel 2+ hours before start</li>
                      <li>• 90% refund (10% processing fee)</li>
                      <li>• Host no-show situations</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <h4 className="font-semibold text-red-700 dark:text-red-300">No Refund</h4>
                    </div>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      <li>• Cancel less than 2 hours before</li>
                      <li>• Player no-show</li>
                      <li>• Match completed normally</li>
                      <li>• Violation of terms</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Deposit Refunds</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4>2.1 Wallet Deposits</h4>
                <p>
                  Deposits made to your GameArena wallet are generally non-refundable once processed. However, refunds may be considered in the following cases:
                </p>
                <ul>
                  <li><strong>Duplicate Transactions:</strong> If you accidentally make multiple deposits for the same amount</li>
                  <li><strong>Technical Errors:</strong> If a technical error results in incorrect deposit amounts</li>
                  <li><strong>Unauthorized Transactions:</strong> If you can prove the transaction was unauthorized</li>
                  <li><strong>Account Closure:</strong> Remaining balance can be withdrawn following our standard withdrawal process</li>
                </ul>
                
                <h4>2.2 Refund Processing Time</h4>
                <p>
                  Approved deposit refunds will be processed within 5-7 business days and credited back to the original payment method.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Withdrawal Cancellations</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4>3.1 Pending Withdrawals</h4>
                <p>
                  You can cancel withdrawal requests that are still in "Pending" status. Once a withdrawal moves to "Processing" or "Approved" status, 
                  it cannot be cancelled.
                </p>
                
                <h4>3.2 How to Cancel</h4>
                <ul>
                  <li>Go to your transaction history in the dashboard</li>
                  <li>Find the pending withdrawal</li>
                  <li>Click "Cancel Withdrawal" if available</li>
                  <li>Funds will be immediately returned to your wallet</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Dispute Resolution Process</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4>4.1 Match Disputes</h4>
                <p>
                  If there's a dispute about match results, entry fees may be held until resolution:
                </p>
                <ul>
                  <li><strong>Evidence Review:</strong> Admin team reviews match footage and evidence</li>
                  <li><strong>Investigation Period:</strong> 24-48 hours for standard disputes</li>
                  <li><strong>Final Decision:</strong> Admin decision is final and binding</li>
                  <li><strong>Refund Distribution:</strong> Entry fees refunded based on investigation outcome</li>
                </ul>
                
                <h4>4.2 Appeal Process</h4>
                <p>
                  Users can appeal dispute decisions within 24 hours by providing additional evidence through our support system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Refund Request Process</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4>5.1 How to Request a Refund</h4>
                <ol>
                  <li><strong>Contact Support:</strong> Submit a ticket through our support system</li>
                  <li><strong>Provide Details:</strong> Include transaction ID, reason for refund, and supporting evidence</li>
                  <li><strong>Review Process:</strong> Our team will review your request within 2-3 business days</li>
                  <li><strong>Decision Notification:</strong> You'll receive an email with our decision and next steps</li>
                  <li><strong>Processing:</strong> Approved refunds are processed within 5-7 business days</li>
                </ol>
                
                <h4>5.2 Required Information</h4>
                <ul>
                  <li>Transaction ID or order number</li>
                  <li>Date and time of transaction</li>
                  <li>Amount involved</li>
                  <li>Detailed reason for refund request</li>
                  <li>Supporting documentation (if applicable)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Special Circumstances</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4>6.1 Platform Maintenance</h4>
                <p>
                  If scheduled maintenance affects ongoing matches, full refunds will be automatically processed within 24 hours.
                </p>
                
                <h4>6.2 Force Majeure Events</h4>
                <p>
                  In case of events beyond our control (natural disasters, government regulations, etc.), 
                  we will work with affected users to provide fair resolution, which may include refunds or match rescheduling.
                </p>
                
                <h4>6.3 Account Violations</h4>
                <p>
                  Users found violating our terms of service may forfeit their right to refunds for related transactions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Processing Fees and Charges</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <h4>7.1 Refund Processing Fees</h4>
                <ul>
                  <li><strong>Match Cancellations:</strong> 10% processing fee for user-initiated cancellations</li>
                  <li><strong>Deposit Refunds:</strong> Payment gateway charges may apply (typically 2-3%)</li>
                  <li><strong>International Transactions:</strong> Additional currency conversion fees may apply</li>
                </ul>
                
                <h4>7.2 Fee Waivers</h4>
                <p>
                  Processing fees are waived for refunds due to platform errors, technical issues, or host-initiated cancellations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Contact Information for Refunds</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  For refund requests and related inquiries, please contact us:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p>
                    <strong>Email:</strong> refunds@gamearena.com<br />
                    <strong>Support Portal:</strong> Available in your dashboard<br />
                    <strong>Phone:</strong> +91 98765 43210 (Business hours only)<br />
                    <strong>Response Time:</strong> 24-48 hours for refund requests
                  </p>
                </div>
                
                <p className="mt-4">
                  <strong>Note:</strong> This policy is subject to change. Users will be notified of any significant updates. 
                  For the most current version, please check this page regularly.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
