"use client";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useFilterStore } from "@/app/properties/store/useFilter";

const housingUnits = [
  "Apartment",
  "Condominium",
  "Duplex",
  "Single Attached house",
  "Single Detached House",
  "All Units",
];
const transactionTypes = ["All Types", "Buy", "Rent", "Lease"];
export default function SearchProperty() {
  const {
    searchTerm,
    transactionType,
    unitType,
    setLocation,
    setTransactionType,
    setUnitType,
  } = useFilterStore();

  const router = useRouter();
  const handleSearch = () => {
    router.push("/properties");
  };
  return (
    <div className=" backdrop-blur supports-[backdrop-filter]:bg-white/20 shadow-md rounded-3xl w-full p-10">
      <motion.div
        className=" flex h-14 gap-x-2 w-full"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.5,
          delay: 1,
        }}
      >
        <div className="flex h-10 gap-x-2 w-full ">
          <div className="flex h-full w-full rounded-lg">
            {transactionTypes.map((type) => (
              <Button
                key={type}
                size={"default"}
                className={cn(
                  "flex-1 hover:bg-gray-300 rounded-none text-muted-foreground bg-white  transition-colors duration-400 ease-in h-full",
                  transactionType === type && "border-b-4 border-b-orange-500"
                )}
                onClick={() => setTransactionType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 1.5,
        }}
        className="flex items-center  gap-x-3 shadow-lg w-full max-w-screen-2xl"
      >
        <Select
          defaultValue={unitType}
          value={unitType}
          onValueChange={(value) => setUnitType(value)}
        >
          <SelectTrigger className="h-full w-1/4 bg-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Unit Type</SelectLabel>
              {housingUnits.map((unit) => (
                <SelectItem key={unit} className="capitalize" value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          name="location"
          className="bg-white text-xs md:text-sm py-5"
          onChange={(e) => setLocation(e.target.value)}
          value={searchTerm ?? ""}
          placeholder="Find locations or development names."
        />
        <Button variant={"orange"} onClick={handleSearch} className="h-full">
          Search
        </Button>
      </motion.div>
    </div>
  );
}
