import { UserProfile } from "@/components/auth/UserProfile";
import { VerificationStatus } from "@/components/auth/VerificationStatus";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <UserProfile />
        <VerificationStatus />
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;