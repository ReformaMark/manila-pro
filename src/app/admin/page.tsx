import { AdminCards } from "./_components/admin-cards";
import { SoldPropertiesChart } from "./_components/sold-properties-chart";
import { UserDistributionChart } from "./_components/user-distribution-chart";
import { HotspotAnalysis } from "./_components/hotspot-analysis";
import { RegionalMarketAnalysis } from "./_components/regional-market-analysis";

function AdminPage() {
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-xl md:text-2xl font-bold">Admin Dashboard</h1>

      <AdminCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SoldPropertiesChart />
        </div>

        <div className="lg:col-span-1">
          <UserDistributionChart />
        </div>
      </div>

      {/* DAR-02: Hotspot Analysis */}
      <HotspotAnalysis />

      {/* DAR-03: Regional Market Analysis */}
      <RegionalMarketAnalysis />
    </div>
  );
}

export default AdminPage;
