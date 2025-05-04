import { z } from "zod";

export const AcceptDealSchema = z.object({
    finalDealPrice: z.coerce.number().min(100, "Input valid price ").max(100000000000, "Input valid price"),
    downPayment: z.coerce.number().min(100, "Input valid down payment value").max(100000000000, "Input valid down payment value"),
    agreedTermInMonths: z.coerce.number().min(1, "Input valid term in months").max(10000, "Input valid term in months"),
})

export type AcceptDealSchemaType = z.infer<typeof AcceptDealSchema>