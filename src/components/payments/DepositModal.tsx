import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { DollarSign, CreditCard, Smartphone, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface DepositModalProps {
  trigger: React.ReactNode;
}

export function DepositModal({ trigger }: DepositModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [utrId, setUtrId] = useState("");
  const [screenshot, setScreenshot] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upi");

  const { user } = useAuth();
  const createDeposit = useMutation(api.transactions.createDeposit);
  const createDepositOrder = useMutation(api.payments.createDepositOrder);

  const handleManualDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to make a deposit");
      return;
    }

    const depositAmount = parseInt(amount);
    if (depositAmount < 10) {
      toast.error("Minimum deposit amount is ₹10");
      return;
    }

    if (!utrId.trim()) {
      toast.error("Please enter UTR ID");
      return;
    }

    setIsLoading(true);
    try {
      await createDeposit({
        amount: depositAmount,
        utrId: utrId.trim(),
        paymentScreenshot: screenshot,
      });

      toast.success("Deposit request submitted! It will be reviewed by admin.");
      setOpen(false);
      setAmount("");
      setUtrId("");
      setScreenshot("");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit deposit request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!user) {
      toast.error("Please sign in to make a deposit");
      return;
    }

    const depositAmount = parseInt(amount);
    if (depositAmount < 10) {
      toast.error("Minimum deposit amount is ₹10");
      return;
    }

    setIsLoading(true);
    try {
      const order = await createDepositOrder({ amount: depositAmount });
      
      // Redirect to Cashfree payment page
      const paymentUrl = `https://sandbox.cashfree.com/billpay/checkout/post/submit?order_id=${order.orderId}&payment_session_id=${order.paymentSessionId}`;
      window.open(paymentUrl, '_blank');
      
      toast.success("Redirecting to payment gateway...");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create payment order");
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Add Money to Wallet
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upi">UPI/Bank Transfer</TabsTrigger>
            <TabsTrigger value="online">Online Payment</TabsTrigger>
          </TabsList>

          {/* Amount Selection */}
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="10"
                max="100000"
                disabled={isLoading}
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {predefinedAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(amt.toString())}
                  disabled={isLoading}
                >
                  ₹{amt}
                </Button>
              ))}
            </div>
          </div>

          <TabsContent value="upi" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  UPI Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="font-mono text-sm">clutchpays@paytm</p>
                  <p className="text-xs text-muted-foreground">UPI ID</p>
                </div>
                
                <div className="bg-muted p-3 rounded-lg">
                  <p className="font-mono text-sm">Account: 1234567890</p>
                  <p className="font-mono text-sm">IFSC: PAYTM0123456</p>
                  <p className="text-xs text-muted-foreground">Bank Transfer</p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                        Important Instructions
                      </p>
                      <ul className="text-xs text-orange-700 dark:text-orange-300 mt-1 space-y-1">
                        <li>• Pay the exact amount shown</li>
                        <li>• Save the UTR/Transaction ID</li>
                        <li>• Upload payment screenshot</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleManualDeposit} className="space-y-4">
              <div>
                <Label htmlFor="utr">UTR/Transaction ID *</Label>
                <Input
                  id="utr"
                  placeholder="Enter UTR or Transaction ID"
                  value={utrId}
                  onChange={(e) => setUtrId(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="screenshot">Payment Screenshot (Optional)</Label>
                <Textarea
                  id="screenshot"
                  placeholder="Paste screenshot URL or describe payment"
                  value={screenshot}
                  onChange={(e) => setScreenshot(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !amount || !utrId}>
                {isLoading ? "Submitting..." : "Submit for Review"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="online" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Instant Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Instant wallet credit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Secure payment gateway</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">UPI, Cards, Net Banking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleOnlinePayment}
              className="w-full" 
              disabled={isLoading || !amount}
            >
              {isLoading ? "Processing..." : `Pay ₹${amount || "0"} Now`}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}