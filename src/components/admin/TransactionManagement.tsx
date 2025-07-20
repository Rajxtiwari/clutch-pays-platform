import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

export function TransactionManagement() {
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  
  const pendingDeposits = useQuery(api.admin.getPendingTransactions, { type: "deposit" });
  const pendingWithdrawals = useQuery(api.admin.getPendingTransactions, { type: "withdrawal" });
  const approveTransaction = useMutation(api.admin.approveTransaction);
  const rejectTransaction = useMutation(api.admin.rejectTransaction);

  const handleApprove = async (transactionId: string, notes?: string) => {
    try {
      await approveTransaction({
        transactionId: transactionId as any,
        approved: true,
        adminNotes: notes,
      });
      toast.success("Transaction approved successfully");
      setAdminNotes("");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve transaction");
    }
  };

  const handleReject = async (transactionId: string, reason: string) => {
    try {
      await rejectTransaction({
        transactionId: transactionId as any,
        adminNotes: reason,
      });
      toast.success("Transaction rejected successfully");
      setRejectionReason("");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject transaction");
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const TransactionCard = ({ transaction, type }: { transaction: any, type: "deposit" | "withdrawal" }) => (
    <Card key={transaction._id} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {type === "deposit" ? "Deposit Request" : "Withdrawal Request"}
          </CardTitle>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Amount</Label>
            <p className="text-lg font-bold text-green-600">
              {formatAmount(transaction.amount)}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">Date</Label>
            <p className="text-sm text-muted-foreground">
              {formatDate(transaction._creationTime)}
            </p>
          </div>
        </div>

        {transaction.utrId && (
          <div>
            <Label className="text-sm font-medium">UTR ID</Label>
            <p className="text-sm font-mono bg-muted p-2 rounded">
              {transaction.utrId}
            </p>
          </div>
        )}

        {transaction.uniqueAmount && (
          <div>
            <Label className="text-sm font-medium">Unique Amount</Label>
            <p className="text-sm text-blue-600">
              ₹{transaction.uniqueAmount.toFixed(2)}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor={`notes-${transaction._id}`}>Admin Notes</Label>
          <Textarea
            id={`notes-${transaction._id}`}
            placeholder="Add notes for approval..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => handleApprove(transaction._id, adminNotes)}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Toggle rejection reason input
              setRejectionReason(rejectionReason ? "" : "Enter rejection reason...");
            }}
            className="flex-1"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>

        {rejectionReason && (
          <div className="space-y-2 pt-2 border-t">
            <Label htmlFor={`rejection-${transaction._id}`}>Rejection Reason</Label>
            <Textarea
              id={`rejection-${transaction._id}`}
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setRejectionReason("")}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(transaction._id, rejectionReason)}
                disabled={!rejectionReason.trim()}
                size="sm"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Transaction Management</h2>
        <p className="text-muted-foreground">
          Review and approve pending deposits and withdrawals
        </p>
      </div>

      <Tabs defaultValue="deposits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deposits">
            Pending Deposits ({pendingDeposits?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="withdrawals">
            Pending Withdrawals ({pendingWithdrawals?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposits" className="space-y-4">
          {pendingDeposits?.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Pending Deposits</h3>
                <p className="text-muted-foreground">
                  All deposit requests have been processed.
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingDeposits?.map((transaction) => (
              <TransactionCard key={transaction._id} transaction={transaction} type="deposit" />
            ))
          )}
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-4">
          {pendingWithdrawals?.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Pending Withdrawals</h3>
                <p className="text-muted-foreground">
                  All withdrawal requests have been processed.
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingWithdrawals?.map((transaction) => (
              <TransactionCard key={transaction._id} transaction={transaction} type="withdrawal" />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}