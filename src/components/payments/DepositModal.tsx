import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { toast } from "sonner";
import { load } from "@cashfreepayments/cashfree-js";
import { DollarSign, Loader2 } from "lucide-react";

interface DepositModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function DepositModal({ trigger, onSuccess }: DepositModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const createDepositOrder = useAction(api.payments.createDepositOrder);
  const verifyPayment = useAction(api.payments.verifyPaymentPublic);

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
    
    if (!depositAmount || depositAmount < 10) {
      toast.error("Minimum deposit amount is ₹10");
      return;
    }

    if (depositAmount > 100000) {
      toast.error("Maximum deposit amount is ₹1,00,000");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const order = await createDepositOrder({ amount: depositAmount });
      
      // Initialize Cashfree
      const cashfree = await load({
        mode: process.env.NODE_ENV === "production" ? "production" : "sandbox"
      });

      if (!cashfree) {
        throw new Error("Failed to load Cashfree SDK");
      }

      // Start payment
      const result = await cashfree.checkout({
        paymentSessionId: order.paymentSessionId,
        redirectTarget: "_modal"
      });

      if (result.error) {
        console.error("Payment error:", result.error);
        toast.error("Payment failed. Please try again.");
      } else if (result.redirect) {
        console.log("Payment requires redirect");
        // Handle redirect if needed
      } else {
        console.log("Payment completed:", result.paymentDetails);
        
        // Verify payment
        const verification = await verifyPayment({ orderId: order.orderId });
        
        if (verification.success) {
          toast.success("Deposit successful! Money added to your wallet.");
          setAmount("");
          setOpen(false);
          onSuccess?.();
        } else {
          toast.error(verification.message);
        }
      }
    } catch (error) {
      console.error("Deposit error:", error);
      toast.error("Deposit failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Add Money
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Add Money to Wallet
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum: ₹10, Maximum: ₹1,00,000
            </p>
          </div>

          <div>
            <Label>Quick Select</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  disabled={isProcessing}
                >
                  ₹{quickAmount}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium mb-2">Payment Methods</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>• UPI (Google Pay, PhonePe, Paytm)</div>
              <div>• Credit/Debit Cards</div>
              <div>• Net Banking</div>
              <div>• Wallets</div>
            </div>
          </div>

          <Button
            onClick={handleDeposit}
            disabled={!amount || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Pay ₹{amount || "0"}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Powered by Cashfree • Secure payments
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}