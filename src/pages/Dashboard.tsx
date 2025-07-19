import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Protected } from "@/lib/protected-page";
import { MatchBrowser } from "@/components/dashboard/MatchBrowser";

export default function Dashboard() {
  return (
    <Protected>
      <DashboardLayout>
        <MatchBrowser />
      </DashboardLayout>
    </Protected>
  );
}