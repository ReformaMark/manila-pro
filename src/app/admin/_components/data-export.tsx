"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Download,
  FileSpreadsheet,
  Users,
  Building2,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import * as XLSX from "xlsx";

export function DataExport() {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const properties = useQuery(api.admin.getAllPropertiesForExport);
  const transactions = useQuery(api.admin.getAllTransactionsForExport);
  const users = useQuery(api.admin.getAllUsersForExport);
  const hotspotData = useQuery(api.admin.getHotspotAnalysis);
  const regionalData = useQuery(api.admin.getRegionalMarketAnalysis);

  const logActivity = useMutation(api.admin_activity.logActivity);

  const exportToExcel = async (
    data: any[],
    filename: string,
    sheetName: string,
    reportType?: string
  ) => {
    setIsExporting(filename);

    try {
      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Convert data to worksheet
      const ws = XLSX.utils.json_to_sheet(data);

      // Auto-size columns
      const colWidths = Object.keys(data[0] || {}).map((key) => ({
        wch:
          Math.max(
            key.length,
            ...data.map((row) => String(row[key] || "").length)
          ) + 2,
      }));
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      // Generate file and trigger download
      XLSX.writeFile(
        wb,
        `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      toast.success(`${sheetName} exported successfully!`);

      // Log the export activity
      try {
        await logActivity({
          action: `exported_${reportType || filename}`,
          actionType: "export",
          description: `Exported ${sheetName} report (${data.length} records)`,
          targetType: "report",
          metadata: {
            reportType: sheetName,
          },
        });
        console.log("Activity logged successfully");
      } catch (logError) {
        console.error("Failed to log activity:", logError);
        // Don't show error to user, export was successful
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(null);
    }
  };

  const exportPropertiesReport = () => {
    if (!properties || properties.length === 0) {
      toast.error("No properties data to export");
      return;
    }
    exportToExcel(properties, "properties_report", "Properties", "properties");
  };

  const exportTransactionsReport = () => {
    if (!transactions || transactions.length === 0) {
      toast.error("No transactions data to export");
      return;
    }
    exportToExcel(
      transactions,
      "transactions_report",
      "Transactions",
      "transactions"
    );
  };

  const exportUsersReport = () => {
    if (!users || users.length === 0) {
      toast.error("No users data to export");
      return;
    }
    exportToExcel(users, "users_report", "Users", "users");
  };

  const exportHotspotReport = () => {
    if (!hotspotData || hotspotData.length === 0) {
      toast.error("No hotspot data to export");
      return;
    }

    const formattedData = hotspotData.map((city: any) => ({
      City: city.city,
      "Total Listings": city.totalListings,
      "Available Listings": city.availableListings,
      "Sold Listings": city.soldListings,
      "Reserved Listings": city.reservedListings,
      "Average Price": city.avgPrice,
      "Popularity Score": city.popularity,
      "Supply/Demand Ratio": city.supplyDemandRatio,
    }));

    exportToExcel(
      formattedData,
      "hotspot_analysis_report",
      "Hotspot Analysis",
      "hotspot_analysis"
    );
  };

  const exportRegionalReport = () => {
    if (!regionalData || regionalData.length === 0) {
      toast.error("No regional data to export");
      return;
    }

    const formattedData = regionalData.map((region: any) => ({
      City: region.city,
      "Total Supply": region.totalSupply,
      "Available Supply": region.availableSupply,
      "Min Price": region.minPrice,
      "Max Price": region.maxPrice,
      "Average Price": region.avgPrice,
      "Total Deals": region.totalDeals,
      "Active Deals": region.activeDeals,
      "Completed Deals": region.completedDeals,
      "Average Deal Value": region.avgDealValue,
      "Absorption Rate (%)": region.absorptionRate,
      "Inventory Months": region.inventoryMonths,
    }));

    exportToExcel(
      formattedData,
      "regional_market_report",
      "Regional Market",
      "regional_market"
    );
  };

  const exportAllReports = async () => {
    if (
      !properties ||
      !transactions ||
      !users ||
      !hotspotData ||
      !regionalData
    ) {
      toast.error("Some data is still loading. Please wait...");
      return;
    }

    setIsExporting("all");

    try {
      const wb = XLSX.utils.book_new();

      // Properties sheet
      const propertiesWs = XLSX.utils.json_to_sheet(properties);
      XLSX.utils.book_append_sheet(wb, propertiesWs, "Properties");

      // Transactions sheet
      const transactionsWs = XLSX.utils.json_to_sheet(transactions);
      XLSX.utils.book_append_sheet(wb, transactionsWs, "Transactions");

      // Users sheet
      const usersWs = XLSX.utils.json_to_sheet(users);
      XLSX.utils.book_append_sheet(wb, usersWs, "Users");

      // Hotspot Analysis sheet
      const hotspotFormatted = hotspotData.map((city: any) => ({
        City: city.city,
        "Total Listings": city.totalListings,
        Available: city.availableListings,
        Sold: city.soldListings,
        Reserved: city.reservedListings,
        "Avg Price": city.avgPrice,
        Popularity: city.popularity,
        "Supply/Demand": city.supplyDemandRatio,
      }));
      const hotspotWs = XLSX.utils.json_to_sheet(hotspotFormatted);
      XLSX.utils.book_append_sheet(wb, hotspotWs, "Hotspot Analysis");

      // Regional Market sheet
      const regionalFormatted = regionalData.map((region: any) => ({
        City: region.city,
        "Total Supply": region.totalSupply,
        Available: region.availableSupply,
        "Avg Price": region.avgPrice,
        "Total Deals": region.totalDeals,
        Active: region.activeDeals,
        Completed: region.completedDeals,
        "Absorption Rate": region.absorptionRate,
      }));
      const regionalWs = XLSX.utils.json_to_sheet(regionalFormatted);
      XLSX.utils.book_append_sheet(wb, regionalWs, "Regional Market");

      // Generate file
      XLSX.writeFile(
        wb,
        `complete_reports_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      toast.success("All reports exported successfully!");

      // Log the export activity
      await logActivity({
        action: "exported_complete_package",
        actionType: "export",
        description: `Exported complete report package (5 sheets, ${properties.length + transactions.length + users.length} total records)`,
        targetType: "report",
        metadata: {
          reportType: "Complete Package",
        },
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export all reports");
    } finally {
      setIsExporting(null);
    }
  };

  const isLoading =
    !properties || !transactions || !users || !hotspotData || !regionalData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />
          Data Export & Reports
        </CardTitle>
        <CardDescription>
          Generate and download reports in Excel format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export All Button */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-50 dark:from-orange-950/20 dark:to-orange-950/20 p-4 rounded-lg border-2 border-orange-200 dark:border-orange-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                Complete Report Package
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-200">
                Export all data in a single Excel file with multiple sheets
              </p>
            </div>
            <Button
              onClick={exportAllReports}
              disabled={isLoading || isExporting !== null}
              className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
              size="lg"
            >
              {isExporting === "all" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export All Reports
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Individual Reports */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {/* Properties Report */}
          <Card className="bg-muted/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Properties</h3>
                  <p className="text-xs text-muted-foreground">
                    {properties?.length || 0} records
                  </p>
                </div>
              </div>
              <Button
                onClick={exportPropertiesReport}
                disabled={isLoading || isExporting !== null}
                variant="outline"
                className="w-full"
                size="sm"
              >
                {isExporting === "properties_report" ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-3 w-3" />
                    Export
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Transactions Report */}
          <Card className="bg-muted/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <FileText className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Transactions</h3>
                  <p className="text-xs text-muted-foreground">
                    {transactions?.length || 0} records
                  </p>
                </div>
              </div>
              <Button
                onClick={exportTransactionsReport}
                disabled={isLoading || isExporting !== null}
                variant="outline"
                className="w-full"
                size="sm"
              >
                {isExporting === "transactions_report" ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-3 w-3" />
                    Export
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Users Report */}
          <Card className="bg-muted/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Users</h3>
                  <p className="text-xs text-muted-foreground">
                    {users?.length || 0} records
                  </p>
                </div>
              </div>
              <Button
                onClick={exportUsersReport}
                disabled={isLoading || isExporting !== null}
                variant="outline"
                className="w-full"
                size="sm"
              >
                {isExporting === "users_report" ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-3 w-3" />
                    Export
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Hotspot Analysis Report */}
          <Card className="bg-muted/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Hotspot Analysis</h3>
                  <p className="text-xs text-muted-foreground">
                    {hotspotData?.length || 0} cities
                  </p>
                </div>
              </div>
              <Button
                onClick={exportHotspotReport}
                disabled={isLoading || isExporting !== null}
                variant="outline"
                className="w-full"
                size="sm"
              >
                {isExporting === "hotspot_analysis_report" ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-3 w-3" />
                    Export
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Regional Market Report */}
          <Card className="bg-muted/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Regional Market</h3>
                  <p className="text-xs text-muted-foreground">
                    {regionalData?.length || 0} regions
                  </p>
                </div>
              </div>
              <Button
                onClick={exportRegionalReport}
                disabled={isLoading || isExporting !== null}
                variant="outline"
                className="w-full"
                size="sm"
              >
                {isExporting === "regional_market_report" ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-3 w-3" />
                    Export
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
          <p className="text-xs md:text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Exported files will include all relevant data
            with proper formatting. File names include the export date for easy
            tracking.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
