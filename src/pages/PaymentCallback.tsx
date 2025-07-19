import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");
  
  const verifyPayment = useAction(api.payments.verifyPaymentPublic);

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    
    if (!orderId) {
      setStatus("failed");
      setMessage("Invalid payment reference");
      return;
    }

    const verifyPaymentStatus = async () => {
      try {
        const result = await verifyPayment({ orderId });
        
        if (result.success) {
          setStatus("success");
          setMessage("Payment successful! Money has been added to your wallet.");
        } else {
          setStatus("failed");
          setMessage(result.message);
        }
      } catch (error) {
        setStatus("failed");
        setMessage("Payment verification failed");
      }
    };

    verifyPaymentStatus();
  }, [searchParams, verifyPayment]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
              <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
              <p className="text-muted-foreground">
                Please wait while we confirm your payment...
              </p>
            </>
          )}
          
          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h2 className="text-xl font-semibold mb-2 text-green-600">Payment Successful!</h2>
              <p className="text-muted-foreground mb-6">{message}</p>
              <Button onClick={() => navigate("/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            </>
          )}
          
          {status === "failed" && (
            <>
              <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2 text-red-600">Payment Failed</h2>
              <p className="text-muted-foreground mb-6">{message}</p>
              <div className="space-y-2">
                <Button onClick={() => navigate("/dashboard")} className="w-full">
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
                  Try Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}