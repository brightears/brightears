import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Clerk user ID
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    
    // User role and type
    role: v.union(
      v.literal("ARTIST"),
      v.literal("CUSTOMER"),
      v.literal("CORPORATE"),
      v.literal("ADMIN")
    ),
    
    // Profile references
    artistId: v.optional(v.id("artists")),
    customerId: v.optional(v.id("customers")),
    corporateId: v.optional(v.id("corporates")),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    lastActive: v.optional(v.number()),
    
    // Preferences
    preferredLanguage: v.optional(v.union(v.literal("en"), v.literal("th"))),
    emailVerified: v.optional(v.boolean()),
    phoneVerified: v.optional(v.boolean()),
  })
    .index("by_clerk", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  artists: defineTable({
    userId: v.id("users"),
    stageName: v.string(),
    bio: v.optional(v.string()),
    category: v.union(
      v.literal("DJ"),
      v.literal("BAND"),
      v.literal("SINGER"),
      v.literal("MUSICIAN"),
      v.literal("MC"),
      v.literal("COMEDIAN"),
      v.literal("MAGICIAN"),
      v.literal("DANCER"),
      v.literal("PHOTOGRAPHER"),
      v.literal("SPEAKER")
    ),
    
    // Profile details
    profileImage: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    baseCity: v.optional(v.string()),
    serviceAreas: v.optional(v.array(v.string())),
    
    // Pricing
    basePrice: v.optional(v.number()),
    currency: v.optional(v.string()),
    pricePerHour: v.optional(v.number()),
    minimumBookingHours: v.optional(v.number()),
    
    // Verification
    verificationLevel: v.union(
      v.literal("UNVERIFIED"),
      v.literal("BASIC"),
      v.literal("VERIFIED"),
      v.literal("TRUSTED")
    ),
    
    // Stats
    rating: v.optional(v.number()),
    totalBookings: v.optional(v.number()),
    totalEarnings: v.optional(v.number()),
    
    // Social links
    instagram: v.optional(v.string()),
    facebook: v.optional(v.string()),
    youtube: v.optional(v.string()),
    website: v.optional(v.string()),
    lineId: v.optional(v.string()),
    
    // Settings
    isActive: v.boolean(),
    instantBooking: v.optional(v.boolean()),
    cancellationPolicy: v.optional(v.string()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_category", ["category"])
    .index("by_city", ["baseCity"])
    .index("by_verification", ["verificationLevel"]),

  customers: defineTable({
    userId: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    lineId: v.optional(v.string()),
    
    // Preferences
    preferredLanguage: v.union(v.literal("en"), v.literal("th")),
    notificationPreferences: v.optional(v.object({
      email: v.boolean(),
      sms: v.boolean(),
      line: v.boolean(),
      push: v.boolean(),
    })),
    
    // Address
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  corporates: defineTable({
    userId: v.id("users"),
    companyName: v.string(),
    contactPerson: v.string(),
    businessRegistration: v.optional(v.string()),
    taxId: v.optional(v.string()),
    
    // Contact
    officePhone: v.optional(v.string()),
    officeAddress: v.optional(v.string()),
    billingAddress: v.optional(v.string()),
    
    // Verification
    isVerified: v.boolean(),
    verificationDocuments: v.optional(v.array(v.string())),
    
    // Credit
    creditLimit: v.optional(v.number()),
    creditUsed: v.optional(v.number()),
    paymentTerms: v.optional(v.string()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_company", ["companyName"]),

  bookings: defineTable({
    customerId: v.id("users"),
    artistId: v.id("artists"),
    
    // Event details
    eventDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    duration: v.number(),
    eventType: v.string(),
    venue: v.string(),
    venueAddress: v.optional(v.string()),
    
    // Status
    status: v.union(
      v.literal("INQUIRY"),
      v.literal("QUOTED"),
      v.literal("CONFIRMED"),
      v.literal("PAID"),
      v.literal("COMPLETED"),
      v.literal("CANCELLED")
    ),
    
    // Pricing
    quotedPrice: v.optional(v.number()),
    finalPrice: v.optional(v.number()),
    depositAmount: v.optional(v.number()),
    depositPaid: v.optional(v.boolean()),
    
    // Communication
    specialRequests: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    cancellationReason: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    confirmedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    cancelledAt: v.optional(v.number()),
  })
    .index("by_customer", ["customerId"])
    .index("by_artist", ["artistId"])
    .index("by_status", ["status"])
    .index("by_date", ["eventDate"]),

  favorites: defineTable({
    userId: v.id("users"),
    artistId: v.id("artists"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_artist", ["artistId"])
    .index("by_user_artist", ["userId", "artistId"]),

  reviews: defineTable({
    bookingId: v.id("bookings"),
    customerId: v.id("users"),
    artistId: v.id("artists"),
    
    rating: v.number(),
    comment: v.optional(v.string()),
    
    // Response from artist
    response: v.optional(v.string()),
    respondedAt: v.optional(v.number()),
    
    // Moderation
    isApproved: v.boolean(),
    isHidden: v.optional(v.boolean()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_artist", ["artistId"])
    .index("by_customer", ["customerId"])
    .index("by_booking", ["bookingId"]),

  messages: defineTable({
    bookingId: v.id("bookings"),
    senderId: v.id("users"),
    recipientId: v.id("users"),
    
    content: v.string(),
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    
    // Attachments
    attachments: v.optional(v.array(v.object({
      url: v.string(),
      type: v.string(),
      name: v.string(),
    }))),
    
    createdAt: v.number(),
  })
    .index("by_booking", ["bookingId"])
    .index("by_sender", ["senderId"])
    .index("by_recipient", ["recipientId"])
    .index("by_unread", ["recipientId", "isRead"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    
    // References
    bookingId: v.optional(v.id("bookings")),
    artistId: v.optional(v.id("artists")),
    
    // Status
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    
    // Action
    actionUrl: v.optional(v.string()),
    actionLabel: v.optional(v.string()),
    
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_unread", ["userId", "isRead"]),
});