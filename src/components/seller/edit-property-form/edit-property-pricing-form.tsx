"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SingleSlider } from "@/components/ui/single-slider";
import {
  formatCurrency,
  formatPriceInput,
  formattedAmortization,
  parsePriceInput,
} from "@/lib/utils";
import { PropertyFormSchema } from "@/lib/validations/property";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface EditPropertyPricingFormProps {
  form: UseFormReturn<z.infer<typeof PropertyFormSchema>>;
}

export const EditPropertyPricingForm = ({
  form,
}: EditPropertyPricingFormProps) => {
  const [formattedPricePerSqm, setFormattedPricePerSqm] = useState("");
  const [formattedTotalContractPrice, setFormattedTotalContractPrice] =
    useState("");
  const [formattedNetContractPrice, setFormattedNetContractPrice] =
    useState("");
  const [formattedTotalSellingPrice, setFormattedTotalSellingPrice] =
    useState("");
  const [formattedMonthlyAmortization, setFormattedMonthlyAmortization] =
    useState("");

  useEffect(() => {
    const pricePerSqm = form.getValues("pricePerSqm");
    const totalContractPrice = form.getValues("totalContractPrice");
    const netContractPrice = form.getValues("netContractPrice");
    const totalSellingPrice = form.getValues("totalSellingPrice");
    const suggestedTermInMonths = form.getValues("suggestedTermInMonths");

    if (totalSellingPrice && suggestedTermInMonths) {
      const monthlyAmortization = totalSellingPrice / suggestedTermInMonths;

      form.setValue("suggestedMonthlyAmortization", monthlyAmortization);
      setFormattedMonthlyAmortization(
        formattedAmortization(monthlyAmortization)
      );
    }

    if (pricePerSqm)
      setFormattedPricePerSqm(formatPriceInput(pricePerSqm.toString()));
    if (totalContractPrice)
      setFormattedTotalContractPrice(
        formatPriceInput(totalContractPrice.toString())
      );
    if (netContractPrice)
      setFormattedNetContractPrice(
        formatPriceInput(netContractPrice.toString())
      );
    if (totalSellingPrice)
      setFormattedTotalSellingPrice(
        formatPriceInput(totalSellingPrice.toString())
      );
  }, [form.watch("totalSellingPrice"), form.watch("suggestedTermInMonths")]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-orange-800 mb-4">
          Property Pricing
        </h2>
        <p className="text-muted-foreground mb-6">
          Set the pricing details for your property.
        </p>
      </div>

      <FormField
        control={form.control}
        name="pricePerSqm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price per Square Meter</FormLabel>
            <FormControl>
              <Input
                value={formattedPricePerSqm}
                onChange={(e) => {
                  const formatted = formatPriceInput(e.target.value);
                  setFormattedPricePerSqm(formatted);
                  field.onChange(parsePriceInput(formatted));
                }}
                placeholder="e.g. ₱50,000"
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </FormControl>
            <FormDescription>
              Enter the price per square meter in PHP.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="totalContractPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Contract Price</FormLabel>
              <FormControl>
                <Input
                  value={formattedTotalContractPrice}
                  onChange={(e) => {
                    const formatted = formatPriceInput(e.target.value);
                    setFormattedTotalContractPrice(formatted);
                    field.onChange(parsePriceInput(formatted));
                  }}
                  placeholder="e.g. ₱5,000,000"
                  className="border-orange-200 focus-visible:ring-orange-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="netContractPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Net Contract Price</FormLabel>
              <FormControl>
                <Input
                  value={formattedNetContractPrice}
                  onChange={(e) => {
                    const formatted = formatPriceInput(e.target.value);
                    setFormattedNetContractPrice(formatted);
                    field.onChange(parsePriceInput(formatted));
                  }}
                  placeholder="e.g. ₱4,800,000"
                  className="border-orange-200 focus-visible:ring-orange-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="totalSellingPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Selling Price</FormLabel>
            <FormControl>
              <Input
                value={formattedTotalSellingPrice}
                onChange={(e) => {
                  const formatted = formatPriceInput(e.target.value);
                  setFormattedTotalSellingPrice(formatted);
                  field.onChange(parsePriceInput(formatted));
                }}
                placeholder="e.g. ₱4,500,000"
                className="border-orange-200 focus-visible:ring-orange-500"
              />
            </FormControl>
            <FormDescription>
              This is the final price you're offering to buyers.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-6 bg-orange-50 p-4 rounded-lg border border-orange-100">
        <h3 className="font-medium text-orange-700">Payment Terms</h3>

        <FormField
          control={form.control}
          name="suggestedTermInMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term Length (Months): {field.value}</FormLabel>
              <FormControl>
                <SingleSlider
                  min={1}
                  max={360}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="[&>.bg-primary]:bg-orange-500"
                />
              </FormControl>
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>1 year</span>
                <span>30 years</span>
              </div>
              <FormDescription>
                Suggested length of payment term in months.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="suggestedMonthlyAmortization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suggested Monthly Amortization</FormLabel>
              <FormControl>
                <Input
                  value={formattedMonthlyAmortization}
                  placeholder="e.g. ₱30,000"
                  disabled
                  className="border-orange-200 focus-visible:ring-orange-500 bg-white"
                />
              </FormControl>
              <FormDescription>
                Recommended monthly payment amount.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div className="mt-4 p-3 bg-white rounded border border-orange-200">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Payment Over Term</span>
                        <span className="font-bold text-orange-700">
                            {formatCurrency(form.getValues("suggestedMonthlyAmortization") * form.getValues("suggestedTermInMonths"))}
                        </span>
                    </div>
                </div> */}
      </div>
    </div>
  );
};
