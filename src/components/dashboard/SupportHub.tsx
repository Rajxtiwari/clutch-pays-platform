import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Send, 
  HelpCircle,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function SupportHub() {
  const { user } = useAuth();
  const userTickets = useQuery(api.support.getUserTickets);
  const createTicket = useMutation(api.support.createTicket);
  
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !subject || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTicket({
        email,
        subject,
        message,
      });
      toast.success("Support ticket created successfully!");
      setSubject("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to create support ticket");
    } finally {
      setIsSubmitting(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <Clock className="h-3 w-3" />;
      case "in_progress": return <AlertCircle className="h-3 w-3" />;
      case "closed": return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const resolvedTickets = userTickets?.filter(ticket => ticket.status === "closed") || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Support Hub</h1>
        <p className="text-muted-foreground">
          Get help with your account, matches, and platform issues
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{userTickets?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{resolvedTickets.length}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm text-muted-foreground">Support Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create New Ticket */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Create Support Ticket</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your issue in detail..."
                  rows={4}
                  required
                />
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating..." : "Create Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Frequently Asked Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">How do I deposit money?</h4>
              <p className="text-sm text-muted-foreground">
                Go to your wallet, click "Deposit", and follow the instructions to transfer money to our account.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">How do withdrawals work?</h4>
              <p className="text-sm text-muted-foreground">
                Request a withdrawal from your wallet. We'll process it within 24-48 hours after verification.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">What if there's a dispute?</h4>
              <p className="text-sm text-muted-foreground">
                Contact support immediately with match details. We'll review the live stream and resolve fairly.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">How do I become a host?</h4>
              <p className="text-sm text-muted-foreground">
                Complete KYC verification and submit host application. We'll review and approve qualified candidates.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Tickets */}
      {userTickets && userTickets.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>My Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userTickets.map((ticket) => (
                <motion.div
                  key={ticket._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{ticket.subject}</h4>
                    <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(ticket.status)}
                        <span className="capitalize">{ticket.status}</span>
                      </div>
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {ticket.message}
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    Created {formatDistanceToNow(new Date(ticket._creationTime), { addSuffix: true })}
                  </p>
                  
                  {ticket.adminResponse && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Admin Response:</p>
                      <p className="text-sm">{ticket.adminResponse}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}