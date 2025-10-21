import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
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
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneVerified: v.optional(v.boolean()),
    agentInfo: v.optional(
      v.object({
        title: v.optional(v.string()), // "Senior Real Estate Agent"
        agency: v.optional(v.string()), ///Manila Premier Realty
        officeAddress: v.optional(v.string()), // "1234 Main St, Makati City, Philippines"
        workingHours: v.optional(
          v.object({
            days: v.string(), // "Mon-Fri"
            hours: v.string(), // "9am-5pm"
          })
        ),
        // bio: v.string(),
        specializations: v.optional(v.array(v.string())),
        languages: v.optional(v.array(v.string())),
        experience: v.optional(v.number()),
        socialMedia: v.optional(
          v.object({
            facebook: v.optional(v.string()),
            instagram: v.optional(v.string()),
            linkedin: v.optional(v.string()),
            X: v.optional(v.string()),
          })
        ),
        areasServed: v.optional(v.array(v.string())),
        licenseNumber: v.optional(v.string()),
        certifications: v.optional(v.array(v.string())), ///"Licensed Real Estate Broker", "Luxury Home Marketing Specialist", "Certified Residential Specialist",
        awards: v.optional(v.array(v.string())), // "Top Producer 2022", "Circle of Excellence 2021"
      })
    ),
    street: v.string(),
    barangay: v.string(),
    city: v.string(),
    role: v.union(v.literal("admin"), v.literal("buyer"), v.literal("seller")),
  })
    .index("by_phone", ["phone"])
    .index("by_email", ["email"]),

  ratings_reviews: defineTable({
    agentId: v.id("users"),
    ratings: v.number(),
    title: v.string(),
    content: v.string(),
    helpful: v.number(),
    notHelpful: v.number(),
    userId: v.id("users"),
  }),

  property: defineTable({
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
    coordinates: v.optional(v.array(v.number())), // coordinates
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
    .searchIndex("by_status", {
      searchField: "status",
    })
    .searchIndex("by_city", {
      searchField: "city",
    }),

  nearby_places: defineTable({
    propertyId: v.id("property"),
    name: v.string(), // name of the place
    type: v.string(),
    coordinates: v.array(v.number()), // coordinates
    distance: v.number(), // in meters
    travelTime: v.string(), // in minutes
    description: v.optional(v.string()),
  }).index("by_propertyId", ["propertyId"]),

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

  ml_models: defineTable({
    modelType: v.string(),
    version: v.string(),
    weights: v.array(v.number()),
    bias: v.number(),
    trainingDate: v.number(),
    samplesUsed: v.number(),
    performance: v.object({
      rmse: v.number(),
      mae: v.optional(v.number()),
      r2Score: v.optional(v.number()),
    }),
    features: v.array(v.string()), // Feature names for reference
    isActive: v.boolean(), // Whether this model version is currently active
    trainingMetadata: v.optional(
      v.object({
        minPrice: v.number(),
        maxPrice: v.number(),
        avgPrice: v.number(),
        totalProperties: v.number(),
      })
    ),
  }).index("by_type_active", ["modelType", "isActive"]),

  admin_activity_logs: defineTable({
    adminId: v.id("users"),
    action: v.string(), // "exported_data", "created_user", "updated_property", etc.
    actionType: v.union(
      v.literal("export"),
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
      v.literal("approve"),
      v.literal("reject"),
      v.literal("login"),
      v.literal("other")
    ),
    targetType: v.optional(v.string()), // "property", "user", "transaction", "report"
    targetId: v.optional(v.string()), // ID of the affected item
    description: v.string(), // Human-readable description
    metadata: v.optional(
      v.object({
        reportType: v.optional(v.string()),
        propertyName: v.optional(v.string()),
        userName: v.optional(v.string()),
        changes: v.optional(v.string()),
      })
    ),
    timestamp: v.number(),
    ipAddress: v.optional(v.string()),
  })
    .index("by_adminId", ["adminId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_actionType", ["actionType"]),

  passwordResetTokens: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    used: v.optional(v.boolean()),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  saved_searches: defineTable({
    userId: v.id("users"),
    query: v.string(),
    name: v.string(),
    transactionType: v.string(),
    unitType: v.string(),
    location: v.string(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    priceRange: v.array(v.number()),
    amenities: v.array(v.string()),
    facilities: v.array(v.string()),
  }).index("by_userId", ["userId"]),

  viewings: defineTable({
    propertyId: v.id("properties"),
    agentId: v.id("users"),
    buyerName: v.string(),
    buyerEmail: v.string(),
    buyerPhone: v.optional(v.string()),
    startTime: v.string(), // ISO date string, e.g. "2025-10-21T10:00:00Z"
    endTime: v.string(), // ISO date string
    status: v.string(), // pending | confirmed | declined
    createdAt: v.number(),
  }),
});
