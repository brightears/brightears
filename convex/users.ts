import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Get or create user from Clerk webhook
export const upsertFromClerk = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
        phone: args.phone,
        updatedAt: Date.now(),
        lastActive: Date.now(),
      });
      return existingUser._id;
    }

    // Create new user with default CUSTOMER role
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      phone: args.phone,
      role: "CUSTOMER",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      preferredLanguage: "en",
      emailVerified: true, // Clerk handles email verification
    });

    // Create customer profile
    const customerId = await ctx.db.insert("customers", {
      userId,
      preferredLanguage: "en",
      notificationPreferences: {
        email: true,
        sms: false,
        line: false,
        push: true,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update user with customer ID
    await ctx.db.patch(userId, {
      customerId,
    });

    return userId;
  },
});

// Get current user by Clerk ID
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    // Get related profile based on role
    let profile = null;
    if (user.role === "ARTIST" && user.artistId) {
      profile = await ctx.db.get(user.artistId);
    } else if (user.role === "CUSTOMER" && user.customerId) {
      profile = await ctx.db.get(user.customerId);
    } else if (user.role === "CORPORATE" && user.corporateId) {
      profile = await ctx.db.get(user.corporateId);
    }

    return {
      ...user,
      profile,
    };
  },
});

// Update user role (for role switching during registration)
export const updateUserRole = mutation({
  args: {
    role: v.union(
      v.literal("ARTIST"),
      v.literal("CUSTOMER"),
      v.literal("CORPORATE")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update role
    await ctx.db.patch(user._id, {
      role: args.role,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

// Create artist profile
export const createArtistProfile = mutation({
  args: {
    stageName: v.string(),
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
    bio: v.optional(v.string()),
    baseCity: v.optional(v.string()),
    basePrice: v.optional(v.number()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if artist profile already exists
    if (user.artistId) {
      const existingArtist = await ctx.db.get(user.artistId);
      if (existingArtist) {
        throw new Error("Artist profile already exists");
      }
    }

    // Create artist profile
    const artistId = await ctx.db.insert("artists", {
      userId: user._id,
      stageName: args.stageName,
      category: args.category,
      bio: args.bio,
      baseCity: args.baseCity,
      basePrice: args.basePrice,
      currency: "THB",
      verificationLevel: "UNVERIFIED",
      isActive: true,
      rating: 0,
      totalBookings: 0,
      totalEarnings: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update user with artist ID and role
    await ctx.db.patch(user._id, {
      artistId,
      role: "ARTIST",
      phone: args.phone || user.phone,
      updatedAt: Date.now(),
    });

    return artistId;
  },
});

// Create corporate profile
export const createCorporateProfile = mutation({
  args: {
    companyName: v.string(),
    contactPerson: v.string(),
    businessRegistration: v.optional(v.string()),
    taxId: v.optional(v.string()),
    officePhone: v.optional(v.string()),
    officeAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if corporate profile already exists
    if (user.corporateId) {
      const existingCorporate = await ctx.db.get(user.corporateId);
      if (existingCorporate) {
        throw new Error("Corporate profile already exists");
      }
    }

    // Create corporate profile
    const corporateId = await ctx.db.insert("corporates", {
      userId: user._id,
      companyName: args.companyName,
      contactPerson: args.contactPerson,
      businessRegistration: args.businessRegistration,
      taxId: args.taxId,
      officePhone: args.officePhone,
      officeAddress: args.officeAddress,
      isVerified: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update user with corporate ID and role
    await ctx.db.patch(user._id, {
      corporateId,
      role: "CORPORATE",
      updatedAt: Date.now(),
    });

    return corporateId;
  },
});

// Get user by email (for migration)
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Update user's last active timestamp
export const updateLastActive = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (user) {
      await ctx.db.patch(user._id, {
        lastActive: Date.now(),
      });
    }
  },
});