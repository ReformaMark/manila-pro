import * as z from "zod"

const AmenityFacilitySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
})

export const PropertyFormSchema = z.object({
    propertyName: z.string().min(5, {
        message: "Property name must be at least 5 characters.",
    }),
    unitType: z.string({
        required_error: "Please select a property type.",
    }),
    bedrooms: z.coerce.number({
        required_error: "Please enter the number of bedrooms.",
    }),
    bathrooms: z.coerce.number({
        required_error: "Please enter the number of bathrooms.",
    }),
    lotArea: z.number().min(1, {
        message: "Lot area must be greater than 0.",
    }),
    maximumOccupants: z.string({
        required_error: "Please enter the maximum number of occupants.",
    }),
    address: z.string().min(5, {
        message: "Address must be at least 5 characters.",
    }),
    city: z.enum(["Makati", "Pasay", "Taguig"], {
        required_error: "Please select a city.",
    }),
    block: z.string({
        required_error: "Please enter the block number.",
    }),
    lot: z.string({
        required_error: "Please enter the lot number.",
    }),
    // lotId: z.string({
    //     required_error: "Please enter the lot ID.",
    // }),
    pricePerSqm: z.number().min(1, {
        message: "Price per square meter must be greater than 0.",
    }),
    totalContractPrice: z.number().min(1, {
        message: "Total contract price must be greater than 0.",
    }),
    netContractPrice: z.number().min(1, {
        message: "Net contract price must be greater than 0.",
    }),
    totalSellingPrice: z.number().min(1, {
        message: "Total selling price must be greater than 0.",
    }),
    suggestedMonthlyAmortization: z.number().min(1, {
        message: "Monthly amortization must be greater than 0.",
    }),
    suggestedTermInMonths: z.number().min(1, {
        message: "Term length must be at least 12 months.",
    }),
    // status: z.enum(["available", "reserved", "sold"], {
    //     required_error: "Please select a status.",
    // }),
    transactionType: z.string({
        required_error: "Please select a transaction type.",
    }),
    displayImage: z.string().min(1, {
        message: "Please upload a display image.",
    }),
    featured: z.coerce.boolean(),
    otherImage: z.array(z.string()).optional(),
    description: z.string().optional(),
    amenities: z.array(AmenityFacilitySchema).optional().default([]),
    facilities: z.array(AmenityFacilitySchema).optional().default([]),
})