"use client";

import { Button } from "@/components/ui/button";
import { usePropertyCompareStore } from "@/store/property-compare-store";
import { formatPrice } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CompareModalProps {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
}

export default function CompareModal({ isOpen, onClose }: CompareModalProps) {
  const { selectedProperties } = usePropertyCompareStore();
  if (!isOpen) return null;

  const features = [
    {
      label: "Price",
      key: "price",
      format: (v: number) => `₱${(v / 1000000).toFixed(1)}M`,
    },
    { label: "Type", key: "type", format: (v: string) => v },
    { label: "Bedrooms", key: "bedrooms", format: (v: number) => `${v}` },
    { label: "Bathrooms", key: "bathrooms", format: (v: number) => `${v}` },
    { label: "Area (sqm)", key: "area", format: (v: number) => `${v}` },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl rounded-lg bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-start">
          <h2 className="text-2xl font-bold text-foreground">
            Compare Properties
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Feature
                </th>
                {selectedProperties.map((property) => (
                  <th
                    key={property._id}
                    className="px-4 py-3 text-center font-semibold text-foreground"
                  >
                    <div className="text-sm">{property.propertyName}</div>
                    <div className="text-xs text-muted-foreground">
                      {property.city}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr
                  key={feature.key}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {feature.label}
                  </td>
                  {selectedProperties.map((property) => (
                    <td
                      key={property._id}
                      className="px-4 py-3 text-center text-foreground"
                    >
                      {feature.label === "Price" &&
                        formatPrice(
                          property.totalSellingPrice,
                          property.transactionType ?? ""
                        )}
                      {feature.label === "Type" && property.unitType}
                      {feature.label === "Bedrooms" && property.bedrooms}
                      {feature.label === "Bathrooms" && property.bathrooms}
                      {feature.label === "Area (sqm)" && property.lotArea}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => onClose(false)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Done Comparing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
