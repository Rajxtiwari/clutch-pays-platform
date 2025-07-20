import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, FileText, User } from "lucide-react";
import { toast } from "sonner";

export function VerificationQueue() {
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  
  const verificationQueue = useQuery(api.admin.getVerificationQueue);
  const approveVerification = useMutation(api.admin.approveVerification);
  const rejectVerification = useMutation(api.admin.rejectVerification);

  const handleApprove = async (requestId: string) => {
    try {
      await approveVerification({
        requestId: requestId as any,
        adminNotes: "Verification approved by admin",
      });
      toast.success("Verification approved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve verification");
    }
  };

  const handleReject = async (requestId: string, reason: string) => {
    try {
      await rejectVerification({ 
        requestId: requestId as any, 
        rejectionReason: reason 
      });
      toast.success("Verification rejected successfully");
      setRejectionReason("");
      setSelectedRequest(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to reject verification");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "player":
        return "bg-blue-100 text-blue-800";
      case "host":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Verification Queue</h2>
        <p className="text-muted-foreground">
          Review and approve user verification requests
        </p>
      </div>

      {verificationQueue?.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Pending Verifications</h3>
            <p className="text-muted-foreground">
              All verification requests have been processed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {verificationQueue?.map((request) => (
            <Card key={request._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Verification Request
                  </CardTitle>
                  <Badge className={getLevelBadgeColor(request.level)}>
                    {request.level.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">User ID</Label>
                    <p className="text-sm text-muted-foreground">
                      {request.userId}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Requested Level</Label>
                    <p className="text-sm font-semibold capitalize">
                      {request.level}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Request Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(request._creationTime)}
                  </p>
                </div>

                {request.documentUrl && (
                  <div>
                    <Label className="text-sm font-medium">Document</Label>
                    <div className="mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(request.documentUrl, '_blank')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Document
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(request._id)}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRequest(request._id);
                      setRejectionReason("");
                    }}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>

                {selectedRequest === request._id && (
                  <div className="space-y-2 pt-2 border-t">
                    <Label htmlFor={`rejection-${request._id}`}>Rejection Reason</Label>
                    <Textarea
                      id={`rejection-${request._id}`}
                      placeholder="Enter reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(null);
                          setRejectionReason("");
                        }}
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(request._id, rejectionReason)}
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
          ))}
        </div>
      )}
    </div>
  );
}