import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { count } from "console";

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
    bio: v.optional(v.string()),
    agentInfo: v.optional(
      v.object({
        title: v.string(), // "Senior Real Estate Agent"
        agency: v.string(), ///Manila Premier Realty
        officeAddress: v.optional(v.string()), // "1234 Main St, Makati City, Philippines"
        workingHours: v.optional(
          v.object({
            days: v.string(), // "Mon-Fri"
            hours: v.string(), // "9am-5pm"
          })
        ),
        bio: v.string(),
        specializations: v.array(v.string()),
        languages: v.array(v.string()),
        experience: v.number(),
        socialMedia: v.object({
          facebook: v.optional(v.string()),
          instagram: v.optional(v.string()),
          linkedin: v.optional(v.string()),
          twitter: v.optional(v.string()),
        }),

        certifications: v.optional(v.array(v.string())), ///"Licensed Real Estate Broker", "Luxury Home Marketing Specialist", "Certified Residential Specialist",
        awards: v.optional(v.array(v.string())), // "Top Producer 2022", "Circle of Excellence 2021"
      })
    ),
    street: v.string(),
    barangay: v.string(),
    city: v.string(),
    role: v.union(v.literal("admin"), v.literal("buyer"), v.literal("seller")),
  }),

  ratings_reviews: defineTable({
    agentId: v.id("users"),
    ratings: v.number(),
    reviews: v.string(),
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
    propertyName: v.string(),
    sellerId: v.id("users"),
    block: v.string(),
    lot: v.string(),
    displayImage: v.string(),
    otherImage: v.optional(v.array(v.string())),
    pricePerSqm: v.number(),
    totalContractPrice: v.number(),
    netContractPrice: v.number(),
    totalSellingPrice: v.number(),
    suggestedMonthlyAmortization: v.number(), // initial
    suggestedTermInMonths: v.number(), // initial
    city: v.union(v.literal("Makati"), v.literal("Pasay"), v.literal("Taguig")),
    status: v.union(
      v.literal("available"), // show
      v.literal("reserved"), // reserved dont show in buyer side
      v.literal("sold") // sold dont show in buyer side
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    //land information
    address: v.string(),
    location: v.optional(v.string()), // coordinates
    propertyType: v.optional(v.string()), // foreclose, pre owned
    featured: v.boolean(),
    //Building information
    storeys: v.optional(v.string()),
    lotArea: v.number(),
    unitType: v.string(), // apartment, condominium, duplex, single attached house, single detached house, townhouse/detached row house
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()), // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    facilities: v.optional(
      v.array(
        v.object({
          name: v.string(),
          description: v.string(),
        })
      )
    ),
    amenities: v.optional(
      v.array(
        v.object({
          name: v.string(),
          description: v.string(),
        })
      )
    ),
    maximumOccupants: v.string(),
    description: v.optional(v.string()),
    transactionType: v.optional(v.string()), // Buy, rent(month to month), Lease(long term rent)
    forecastedPrice: v.optional(v.number()),
    forecastedDate: v.optional(v.number()),
    //Price details
  })
    // .searchIndex("by_project", {
    //     searchField: "projectId",
    // })
    .searchIndex("by_status", {
      searchField: "status",
    })
    .searchIndex("by_city", {
      searchField: "city",
    }),
  deal: defineTable({
    propertyId: v.id("property"),
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    proposal: v.object({
      offer: v.number(), // initial price offered by buyer
      message: v.optional(v.string()), // message from buyer to seller
      moveInDate: v.optional(v.string()), // date of move in
      duration: v.optional(v.number()), // duration in months for rent/lease
      counterOffer: v.optional(
        v.object({
          price: v.number(), // counter offer price
          message: v.optional(v.string()),
          createdAt: v.number(), // date of counter offer
        })
      ),
    }), // initial price offered by buyer
    finalDealPrice: v.optional(v.number()), // agreed final price. Magkakaroon neto kapag active na at na-final na kung gano na talaga ka-magkano ang napagusapan upon offers. (Dating dealPrice)
    downPayment: v.optional(v.number()), // initial payment
    agreedMonthlyAmortization: v.optional(v.number()), // napagusapan na presyo (finalDealPrice - Down Payment) / Term. Auto calculated ata to.
    agreedTermInMonths: v.optional(v.number()), // napagusapan na presyo
    status: v.union(
      v.literal("pending_approval"), // Initial state when buyer makes an offer
      v.literal("negotiating"), // When seller is sending counter offers
      v.literal("approved"), // Seller approved the deal
      v.literal("rejected"), // Seller rejected the deal
      v.literal("active"), // Deal is active, payments ongoing
      v.literal("completed"), // All payments made, deal fulfilled
      v.literal("cancelled") // Deal cancelled after approval
    ),
    requestDate: v.number(),
    approvalDate: v.optional(v.number()), // kelan inapprove or nag ongoing yung payment
    remarks: v.optional(v.string()),
  })
    .index("by_sellerId", ["sellerId"])
    .index("by_propertyId", ["propertyId"])
    .searchIndex("by_property", {
      searchField: "propertyId",
    })
    .searchIndex("by_status", {
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
    ),
  }).searchIndex("by_deal", {
    searchField: "dealId",
  }),
  historical_prices: defineTable({
    propertyId: v.id("property"),
    recordedAt: v.number(),
    pricePerSqm: v.number(),
    totalPrice: v.number(),
  }).searchIndex("by_property", {
    searchField: "propertyId",
  }),
  market_trends: defineTable({
    city: v.string(),
    recordedAt: v.number(),
    avgPricePerSqm: v.number(),
    demandIndex: v.optional(v.number()),
  }).searchIndex("by_city", {
    searchField: "city",
  }),

  saved_properties: defineTable({
    propertyId: v.id("property"),
    userId: v.id("users"),
  })
    .index("by_userId", ["userId"])
    .searchIndex("by_property", {
      searchField: "propertyId",
    })
    .searchIndex("by_user", {
      searchField: "userId",
    }),
  conversations: defineTable({
    participantsId: v.array(v.id("users")),
  }),
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    receiverId: v.id("users"),
    content: v.string(),
    isRead: v.boolean(),
  }).index("by_conversationId", ["conversationId"]),
});
