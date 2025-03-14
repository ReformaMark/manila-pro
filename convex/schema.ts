import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
    ...authTables,
    users: defineTable({
        accountId: v.string(),
        // realtyId: v.optional(v.id("realty"))
        fname: v.string(),
        lname: v.string(),
        email: v.string(),
        emailVerified: v.optional(v.string()),
        image: v.optional(v.string()),
        contact: v.string(),
        houseNumber: v.string(),
        street: v.string(),
        barangay: v.string(),
        city: v.string(),
        role: v.union(
            v.literal("admin"),
            v.literal("buyer"),
            v.literal("seller"),
        ),

    }),
    // project: defineTable({
    //     projectName: v.string(),
    //     tagName: v.string(),
    //     projectLocation: v.string(),
    //     photo: v.string(),
    // }).searchIndex("projectName", {
    //     searchField: "projectName",
    // }),
    // realty: defineTable({
    //     realtyName: v.string(),
    //     tagName: v.string(),
    //     contactPerson: v.string(),
    //     contactNumber: v.string(),
    //     photo: v.string(),
    // }).searchIndex("realtyName", {
    //     searchField: "realtyName",
    // }),
    property: defineTable({
        // projectId: v.id("project"),
        sellerId: v.id("users"),
        lotId: v.string(),
        block: v.string(),
        lot: v.string(),
        lotArea: v.number(),
        pricePerSqm: v.number(),
        totalContractPrice: v.number(),
        netContractPrice: v.number(),
        totalSellingPrice: v.number(),
        suggestedMonthlyAmortization: v.number(), // initial
        suggestedTermInMonths: v.number(), // initial
        status: v.union(
            v.literal("available"),
            v.literal("reserved"),
            v.literal("sold"),
        ),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        // .searchIndex("by_project", {
        //     searchField: "projectId",
        // })
        .searchIndex("by_status", {
            searchField: "status",
        }),
    deal: defineTable({
        propertyId: v.id("property"),
        buyerId: v.id("user"),
        sellerId: v.id("user"),
        dealPrice: v.number(),
        downPayment: v.number(),
        agreedMonthlyAmortization: v.number(), // napagusapan na presyo
        agreedTermInMonths: v.number(), // napagusapan na presyo
        status: v.union(
            v.literal("pending_approval"),    // Initial state when buyer makes an offer
            v.literal("approved"),            // Seller approved the deal
            v.literal("rejected"),            // Seller rejected the deal
            v.literal("processing_payment"),   // Deal approved, waiting for payment
            v.literal("active"),              // Deal is active, payments ongoing
            v.literal("completed"),           // All payments made, deal fulfilled
            v.literal("cancelled")            // Deal cancelled after approval
        ),
        requestDate: v.number(),
        approvalDate: v.optional(v.number()),
        remarks: v.optional(v.string()),
    }).searchIndex("by_property", {
        searchField: "propertyId",
    }).searchIndex("by_status", {
        searchField: "status",
    }),
    document: defineTable({
        dealId: v.id("deal"),
        documentType: v.string(),
        file: v.string(),
    }).searchIndex("by_deal", {
        searchField: "dealId",
    }),
    payment: defineTable({
        dealId: v.id("deal"), // maraming payment sa isang deal
        amount: v.number(),
        dueDate: v.number(), // 
        paymentDate: v.optional(v.number()), //
        status: v.union(
            v.literal("pending"),
            v.literal("paid"),
            v.literal("overdue"),
            v.literal("cancelled")
        ),
        paymentType: v.union(
            v.literal("downpayment"), // initial payment
            v.literal("monthly"), // monthly payment
            v.literal("final") // final payment
        )
    }).searchIndex("by_deal", {
        searchField: "dealId"
    })

})