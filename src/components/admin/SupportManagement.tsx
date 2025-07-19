import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { MessageSquare, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Ticket {
  _id: string;
  _creationTime: number;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "closed";
  email: string;
  userId?: string;
  matchId?: string;
  adminResponse?: string;
  user?: {
    name?: string;
  };
}

export function SupportManagement() {
  const tickets = useQuery(api.admin.getAllSupportTickets) as Ticket[] | undefined;
  const updateTicketStatus = useMutation(api.admin.updateTicketStatus);

  const [adminResponse, setAdminResponse] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const handleStatusUpdate = async (ticketId: string, status: string, response?: string) => {
    try {
      await updateTicketStatus({ 
        ticketId: ticketId as any, 
        status: status as any,
        adminResponse: response 
      });
      toast.success("Ticket status updated successfully");
      setAdminResponse("");
      setSelectedTicket(null);
    } catch (error) {
      toast.error("Failed to update ticket status");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <Clock className="h-4 w-4 text-blue-500" />;
      case "in_progress": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "closed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-500";
      case "in_progress": return "bg-yellow-500";
      case "closed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (subject: string) => {
    if (subject.includes("deposit") || subject.includes("withdrawal")) {
      return "border-l-red-500";
    }
    if (subject.includes("match") || subject.includes("dispute")) {
      return "border-l-orange-500";
    }
    return "border-l-blue-500";
  };

  const openTickets = tickets?.filter((t: Ticket) => t.status === "open") || [];
  const inProgressTickets = tickets?.filter((t: Ticket) => t.status === "in_progress") || [];
  const closedTickets = tickets?.filter((t: Ticket) => t.status === "closed") || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{openTickets.length}</p>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{inProgressTickets.length}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{closedTickets.length}</p>
                <p className="text-sm text-muted-foreground">Closed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Support Tickets ({tickets?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets?.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Support Tickets</h3>
                <p className="text-muted-foreground">
                  All support requests have been handled.
                </p>
              </div>
            ) : (
              tickets?.map((ticket: Ticket, index: number) => (
                <motion.div
                  key={ticket._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`border-l-4 ${getPriorityColor(ticket.subject)} border rounded-lg p-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">
                          {ticket.subject.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </h4>
                        <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(ticket.status)}
                            <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                        <div>From: {ticket.user?.name || ticket.email}</div>
                        <div>
                          Created: {formatDistanceToNow(new Date(ticket._creationTime), { addSuffix: true })}
                        </div>
                        {ticket.matchId && (
                          <div>Match ID: {ticket.matchId}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <p className="text-sm">{ticket.message}</p>
                      </div>

                      {ticket.adminResponse && (
                        <div className="bg-muted p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium mb-1">Admin Response:</p>
                          <p className="text-sm">{ticket.adminResponse}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Select
                        value={ticket.status}
                        onValueChange={(value) => {
                          if (value === "closed" || value === "in_progress") {
                            setSelectedTicket(ticket._id);
                          } else {
                            handleStatusUpdate(ticket._id, value);
                          }
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Dialog open={selectedTicket === ticket._id} onOpenChange={(open) => !open && setSelectedTicket(null)}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Ticket Status</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Ticket: {ticket.subject.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </p>
                              <p className="text-sm text-muted-foreground mb-4">
                                From: {ticket.user?.name || ticket.email}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Admin Response</label>
                              <Textarea
                                value={adminResponse}
                                onChange={(e) => setAdminResponse(e.target.value)}
                                placeholder="Provide a response to the user..."
                                rows={4}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setAdminResponse("");
                                  setSelectedTicket(null);
                                }}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleStatusUpdate(ticket._id, "in_progress", adminResponse)}
                                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                              >
                                Mark In Progress
                              </Button>
                              <Button
                                onClick={() => handleStatusUpdate(ticket._id, "closed", adminResponse)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                Close Ticket
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