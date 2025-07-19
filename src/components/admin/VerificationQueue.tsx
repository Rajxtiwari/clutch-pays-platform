import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Eye, FileText, Clock } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function VerificationQueue() {
  const verificationRequests = useQuery(api.admin.getVerificationQueue);
  const approveVerification = useMutation(api.admin.approveVerification);
  const rejectVerification = useMutation(api.admin.rejectVerification);

  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async (requestId: string) => {
    try {
      await approveVerification({ requestId: requestId as any });
      toast.success("Verification approved successfully");
    } catch (error) {
      toast.error("Failed to approve verification");
    }
  };

  const handleReject = async (requestId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectVerification({ requestId: requestId as any, reason });
      toast.success("Verification rejected");
      setRejectionReason("");
    } catch (error) {
      toast.error("Failed to reject verification");
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "host": return "bg-purple-500";
      case "player": return "bg-green-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Verification Queue ({verificationRequests?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verificationRequests?.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Pending Verifications</h3>
                <p className="text-muted-foreground">
                  All verification requests have been processed.
                </p>
              </div>
            ) : (
              verificationRequests?.map((request, index) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">
                          {request.user?.name || "Unknown User"}
                        </h4>
                        <Badge className={`${getLevelColor(request.level)} text-white`}>
                          {request.level.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                        <div>Email: {request.user?.email || "No email"}</div>
                        <div>
                          Submitted: {formatDistanceToNow(new Date(request._creationTime), { addSuffix: true })}
                        </div>
                      </div>

                      {request.documentUrl && (
                        <div className="mb-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                View Document
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Verification Document</DialogTitle>
                              </DialogHeader>
                              <div className="flex justify-center">
                                <img 
                                  src={request.documentUrl} 
                                  alt="Verification Document"
                                  className="max-w-full max-h-96 object-contain"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request._id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Verification</DialogTitle>
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
                                onClick={() => handleReject(request._id, rejectionReason)}
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}