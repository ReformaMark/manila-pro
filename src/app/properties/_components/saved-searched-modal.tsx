"use client";

import { Loader, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useFilterStore } from "../store/useFilter";

interface SavedSearchesModalProps {
  isOpen: boolean;
  onClose: (showSavedSearches: boolean) => void;
}
interface FilterTypes {
  transactionType: string;
  unitType: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  priceRange: number[];
  amenities: string[];
  facilities: string[];
}
interface SavedSearchType {
  _id: Id<"saved_searches">;
  userId: Id<"users">;
  query: string;
  name: string;
  filters: FilterTypes;
}

export default function SavedSearchesModal({
  isOpen,
  onClose,
}: SavedSearchesModalProps) {
  const savedSearches = useQuery(api.saved_searches.getSavedSearches);
  const deleteSearch = useMutation(api.saved_searches.deleteSavedSearch);
  const {
    setTransactionType,
    setUnitType,
    setLocation,
    setBedrooms,
    setBathrooms,
    setPriceRange,
    setAmenities,
    setFacilities,
    setSearchTerm,
  } = useFilterStore();

  const formatFilters = (search: SavedSearchType): string[] => {
    const activeFilters: string[] = [];

    if (search.filters.location !== "all")
      activeFilters.push(`Location: ${search.filters.location}`);
    if (search.filters.transactionType !== "all")
      activeFilters.push(`Type: ${search.filters.transactionType}`);
    if (search.filters.unitType !== "all")
      activeFilters.push(`Unit: ${search.filters.unitType}`);
    if (search.filters.bedrooms !== 0)
      activeFilters.push(
        `${search.filters.bedrooms} bed${search.filters.bedrooms > 1 && "s"}`
      );
    if (search.filters.bathrooms !== 0)
      activeFilters.push(
        `${search.filters.bathrooms} bath${search.filters.bathrooms > 1 && "s"}`
      );
    if (search.filters.priceRange[1] < 100000000)
      activeFilters.push(
        `Max: ₱${(search.filters.priceRange[1] / 1000000).toFixed(1)}M`
      );
    if (search.filters.amenities.length > 0)
      activeFilters.push(`Amenities: ${search.filters.amenities.length}`);
    if (search.filters.facilities.length > 0)
      activeFilters.push(`Facilities: ${search.filters.facilities.length}`);

    return activeFilters;
  };

  const onLoadSearch = (query: string, filters: FilterTypes) => {
    setTransactionType(filters.transactionType);
    setUnitType(filters.unitType);
    setLocation(filters.location);
    setBedrooms(filters.bathrooms);
    setBathrooms(filters.bathrooms);
    setPriceRange(filters.priceRange);
    setAmenities(filters.amenities);
    setFacilities(filters.facilities);
    setSearchTerm(query);
    onClose(false);
  };
  const onDeleteSearch = (id: Id<"saved_searches">) => {
    toast.promise(deleteSearch({ savedSearchId: id }), {
      loading: "Removing saved filters...",
      success: "Removed saved filters.",
      error: "Error: Removing saved filters.",
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl rounded-lg bg-background p-6 shadow-lg max-h-[80vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between sticky top-0 bg-background pb-4">
          <h2 className="text-xl font-bold text-foreground">Saved Filters</h2>
        </div>

        {savedSearches !== undefined ? (
          savedSearches.length > 0 ? (
            <div className="space-y-3">
              {savedSearches.map((search) => {
                const activeFilters = formatFilters(search);
                return (
                  <div
                    key={search._id}
                    className="rounded-lg border border-border bg-card p-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">
                          {search.name}
                        </p>
                        {search.query && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Query: {search.query}
                          </p>
                        )}
                        {activeFilters.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {activeFilters.map((filter, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded"
                              >
                                {filter}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onLoadSearch(search.query, search.filters)
                          }
                        >
                          Load
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeleteSearch(search._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No saved filters yet
            </p>
          )
        ) : (
          <div className="flex size-full items-center justify-center">
            <Loader className="animate-spin text-brand-orange size-10" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
