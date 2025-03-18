import { AdminCards } from "./_components/admin-cards";
import { SoldPropertiesChart } from "./_components/sold-properties-chart";
import { UserDistributionChart } from "./_components/user-distribution-chart";


function AdminPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <AdminCards />

      <div className="grid md:grid-cols-3 gap-4">
        <div className="col-span-3 md:col-span-2">
          <SoldPropertiesChart />
        </div>

        <div className="col-span-3 md:col-span-1">
          <UserDistributionChart />
        </div>
      </div>
    </div>
  )
}

export default AdminPage;