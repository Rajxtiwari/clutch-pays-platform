import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Users, DollarSign, GamepadIcon, MessageSquare, AlertTriangle, TrendingUp } from "lucide-react";
import { useQuery } from "convex/react";
import { UserManagement } from "./UserManagement";
import { VerificationQueue } from "./VerificationQueue";
import { TransactionManagement } from "./TransactionManagement";
import { SupportManagement } from "./SupportManagement";

export function AdminDashboard() {
  const stats = useQuery(api.admin.getDashboardStats);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, transactions, and platform operations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-xs text-green-600">+{stats?.newUsersToday || 0} today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <GamepadIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats?.activeMatches || 0}</p>
                <p className="text-sm text-muted-foreground">Active Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  {(stats?.pendingVerifications || 0) + (stats?.pendingDeposits || 0) + (stats?.pendingWithdrawals || 0)}
                </p>
                <p className="text-sm text-muted-foreground">Pending Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <div>
                <p className="text-xl font-bold text-orange-600">{stats?.pendingVerifications || 0}</p>
                <p className="text-sm text-orange-600">Pending Verifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-xl font-bold text-blue-600">{stats?.pendingDeposits || 0}</p>
                <p className="text-sm text-blue-600">Pending Deposits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-xl font-bold text-green-600">{stats?.pendingWithdrawals || 0}</p>
                <p className="text-sm text-green-600">Pending Withdrawals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-xl font-bold text-purple-600">{stats?.openTickets || 0}</p>
                <p className="text-sm text-purple-600">Open Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="verification">Verification Queue</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="verification">
          <VerificationQueue />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionManagement />
        </TabsContent>

        <TabsContent value="support">
          <SupportManagement />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
