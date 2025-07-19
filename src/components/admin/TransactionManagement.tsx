import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Eye, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function TransactionManagement() {
  const pendingDeposits = useQuery(api.admin.getPendingTransactions, { type: "deposit" });
  const pendingWithdrawals = useQuery(api.admin.getPendingTransactions, { type: "withdrawal" });
  const approveTransaction = useMutation(api.admin.approveTransaction);
  const rejectTransaction = useMutation(api.admin.rejectTransaction);

  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const handleApprove = async (transactionId: string, notes?: string) => {
    try {
      await approveTransaction({ 
        transactionId: transactionId as any,
        adminNotes: notes 
      });
      toast.success("Transaction approved successfully");
      setAdminNotes("");
    } catch (error) {
      toast.error("Failed to approve transaction");
    }
  };

  const handleReject = async (transactionId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectTransaction({ 
        transactionId: transactionId as any, 
        reason 
      });
      toast.success("Transaction rejected");
      setRejectionReason("");
    } catch (error) {
      toast.error("Failed to reject transaction");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const TransactionCard = ({ transaction, type }: { transaction: any, type: "deposit" | "withdrawal" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border rounded-lg p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {type === "deposit" ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <h4 className="font-semibold">
              {formatCurrency(transaction.amount)}
            </h4>
            <Badge variant="outline">
              {type.toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
            <div>User: {transaction.user.name || transaction.user.email}</div>
            <div>
              Submitted: {formatDistanceToNow(new Date(transaction._creationTime), { addSuffix: true })}
            </div>
            {transaction.utrId && (
              <div>UTR: {transaction.utrId}</div>
            )}
            {transaction.uniqueAmount && (
              <div>Unique Amount: {formatCurrency(transaction.uniqueAmount)}</div>
            )}
          </div>

          {transaction.paymentScreenshot && (
            <div className="mb-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View Screenshot
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Payment Screenshot</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <img 
                      src={transaction.paymentScreenshot} 
                      alt="Payment Screenshot"
                      className="max-w-full max-h-96 object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        <div className="flex space-x-2 ml-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Transaction: {formatCurrency(transaction.amount)} {type}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    User: {transaction.user.name || transaction.user.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Admin Notes (Optional)</label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add any notes about this transaction..."
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleApprove(transaction._id, adminNotes)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="destructive">
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Rejection Reason</label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a clear reason for rejection..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setRejectionReason("")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(transaction._id, rejectionReason)}
                    disabled={!rejectionReason.trim()}
                    className="flex-1"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="deposits" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposits">
            Pending Deposits ({pendingDeposits?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="withdrawals">
            Pending Withdrawals ({pendingWithdrawals?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposits">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Pending Deposits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDeposits?.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Pending Deposits</h3>
                    <p className="text-muted-foreground">
                      All deposit requests have been processed.
                    </p>
                  </div>
                ) : (
                  pendingDeposits?.map((transaction) => (
                    <TransactionCard 
                      key={transaction._id} 
                      transaction={transaction} 
                      type="deposit" 
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                Pending Withdrawals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingWithdrawals?.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Pending Withdrawals</h3>
                    <p className="text-muted-foreground">
                      All withdrawal requests have been processed.
                    </p>
                  </div>
                ) : (
                  pendingWithdrawals?.map((transaction) => (
                    <TransactionCard 
                      key={transaction._id} 
                      transaction={transaction} 
                      type="withdrawal" 
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
