import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
    ...authTables,
    users: defineTable({
        accountId: v.string(),
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

        realtyId: v.optional(v.id("realty"))
    }),
    project: defineTable({
        projectName: v.string(),
        tagName: v.string(),
        projectLocation: v.string(),
        photo: v.string(),
    }).searchIndex("projectName", {
        searchField: "projectName",
    }),
    realty: defineTable({
        realtyName: v.string(),
        tagName: v.string(),
        contactPerson: v.string(),
        contactNumber: v.string(),
        photo: v.string(),
    }).searchIndex("realtyName", {
        searchField: "realtyName",
    }),
    property: defineTable({
        projectId: v.id("project"),
        lotId: v.string(),
        block: v.string(),
        lot: v.string(),
        lotArea: v.number(),
        pricePerSqm: v.number(),
        totalContractPrice: v.number(),
        netContractPrice: v.number(),
        totalSellingPrice: v.number(),
        monthlyAmortization: v.number(),
        term: v.number(),
        status: v.union(
            v.literal("available"),
            v.literal("reserved"),
            v.literal("sold"),
            v.literal("due")
        ),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).searchIndex("by_project", {
        searchField: "projectId",
    }).searchIndex("by_status", {
        searchField: "status",
    }),
    deal: defineTable({
        propertyId: v.id("property"),
        buyerId: v.id("user"),
        sellerId: v.id("user"),
        dealPrice: v.number(),
        downPayment: v.number(),
        monthlyAmortization: v.number(),
        term: v.number(),
        status: v.union(
            v.literal("pending"),
            v.literal("approved"),
            v.literal("rejected"),
            v.literal("closed"),
        ),
        createdAt: v.number(),
        updatedAt: v.number(),
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

})