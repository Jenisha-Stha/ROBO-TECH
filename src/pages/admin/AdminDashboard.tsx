import { AdminLayout } from "@/components/admin/AdminLayout";
import UserDashboard from "@/components/admin/UserDashboard";

export default function AdminDashboard() {
  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome back"
    >
      <div className="space-y-6">
        {/* <DashboardOverview /> */}
        <UserDashboard />

        {/* <KidsColorfulQuiz /> */}

      </div>
    </AdminLayout>
  );
}