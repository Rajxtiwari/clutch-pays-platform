import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Users, Shield, Crown } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function UserManagement() {
  const users = useQuery(api.admin.getAllUsers);
  const updateUserRole = useMutation(api.admin.updateUserRole);
  const updateUserVerification = useMutation(api.admin.updateUserVerification);

  const handleRoleUpdate = async (userId: string, role: string) => {
    try {
      await updateUserRole({ userId: userId as any, role: role as any });
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleVerificationUpdate = async (userId: string, level: string) => {
    try {
      await updateUserVerification({ userId: userId as any, verificationLevel: level as any });
      toast.success("User verification level updated successfully");
    } catch (error) {
      toast.error("Failed to update verification level");
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "admin": return <Crown className="h-4 w-4 text-yellow-500" />;
      case "member": return <Shield className="h-4 w-4 text-blue-500" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getVerificationColor = (level?: string) => {
    switch (level) {
      case "host": return "bg-purple-500";
      case "player": return "bg-green-500";
      case "unverified": return "bg-yellow-500";
      case "pending_email": return "bg-orange-500";
      default: return "bg-gray-500";
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
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Matches</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span className="font-medium">{user.name || "Unnamed"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role || "user"}
                        onValueChange={(value) => handleRoleUpdate(user._id, value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.verificationLevel || "unverified"}
                        onValueChange={(value) => handleVerificationUpdate(user._id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending_email">Pending Email</SelectItem>
                          <SelectItem value="unverified">Unverified</SelectItem>
                          <SelectItem value="player">Player</SelectItem>
                          <SelectItem value="host">Host</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        ₹{(user.walletBalance || 0).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.totalMatches || 0} total</div>
                        <div className="text-muted-foreground">
                          {user.totalWins || 0} wins
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(user._creationTime), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}