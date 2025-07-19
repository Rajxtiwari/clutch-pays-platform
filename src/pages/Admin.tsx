import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Protected } from "@/lib/protected-page";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return (
      <Protected>
        <DashboardLayout>
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-muted-foreground">
                You don't have permission to access the admin panel.
              </p>
            </CardContent>
          </Card>
        </DashboardLayout>
      </Protected>
    );
  }

  return (
    <Protected>
      <DashboardLayout>
        <AdminDashboard />
      </DashboardLayout>
    </Protected>
  );
}