import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all artists with optional filters
export const getArtists = query({
  args: {
    category: v.optional(v.string()),
    city: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    verifiedOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let artistsQuery = ctx.db.query("artists");

    // Apply filters
    if (args.category) {
      artistsQuery = artistsQuery.filter((q) =>
        q.eq(q.field("category"), args.category as any)
      );
    }

    if (args.city) {
      artistsQuery = artistsQuery.filter((q) =>
        q.eq(q.field("baseCity"), args.city)
      );
    }

    if (args.verifiedOnly) {
      artistsQuery = artistsQuery.filter((q) =>
        q.neq(q.field("verificationLevel"), "UNVERIFIED")
      );
    }

    // Get all artists first
    let artists = await artistsQuery.collect();

    // Filter by price range
    if (args.minPrice !== undefined || args.maxPrice !== undefined) {
      artists = artists.filter((artist) => {
        const price = artist.basePrice || 0;
        if (args.minPrice !== undefined && price < args.minPrice) return false;
        if (args.maxPrice !== undefined && price > args.maxPrice) return false;
        return true;
      });
    }

    // Apply limit
    if (args.limit) {
      artists = artists.slice(0, args.limit);
    }

    // Get user info for each artist
    const artistsWithUsers = await Promise.all(
      artists.map(async (artist) => {
        const user = await ctx.db.get(artist.userId);
        return {
          ...artist,
          user: user ? {
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
          } : null,
        };
      })
    );

    return artistsWithUsers;
  },
});

// Get single artist by ID
export const getArtistById = query({
  args: { artistId: v.id("artists") },
  handler: async (ctx, args) => {
    const artist = await ctx.db.get(args.artistId);
    if (!artist) return null;

    const user = await ctx.db.get(artist.userId);
    
    // Get reviews
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_artist", (q) => q.eq("artistId", args.artistId))
      .filter((q) => q.eq(q.field("isApproved"), true))
      .collect();

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return {
      ...artist,
      user: user ? {
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      } : null,
      reviews,
      averageRating: avgRating,
      reviewCount: reviews.length,
    };
  },
});

// Get artist profile for current user
export const getMyArtistProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || !user.artistId) return null;

    return await ctx.db.get(user.artistId);
  },
});

// Update artist profile
export const updateArtistProfile = mutation({
  args: {
    stageName: v.optional(v.string()),
    bio: v.optional(v.string()),
    category: v.optional(v.string()),
    baseCity: v.optional(v.string()),
    serviceAreas: v.optional(v.array(v.string())),
    basePrice: v.optional(v.number()),
    pricePerHour: v.optional(v.number()),
    minimumBookingHours: v.optional(v.number()),
    profileImage: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    instagram: v.optional(v.string()),
    facebook: v.optional(v.string()),
    youtube: v.optional(v.string()),
    website: v.optional(v.string()),
    lineId: v.optional(v.string()),
    instantBooking: v.optional(v.boolean()),
    cancellationPolicy: v.optional(v.string()),
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

    if (!user || !user.artistId) {
      throw new Error("Artist profile not found");
    }

    const updateData: any = {
      ...args,
      updatedAt: Date.now(),
    };

    // Handle category enum conversion
    if (args.category) {
      updateData.category = args.category as any;
    }

    await ctx.db.patch(user.artistId, updateData);

    return user.artistId;
  },
});

// Toggle artist active status
export const toggleArtistActive = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || !user.artistId) {
      throw new Error("Artist profile not found");
    }

    const artist = await ctx.db.get(user.artistId);
    if (!artist) {
      throw new Error("Artist not found");
    }

    await ctx.db.patch(user.artistId, {
      isActive: !artist.isActive,
      updatedAt: Date.now(),
    });

    return !artist.isActive;
  },
});

// Search artists by text
export const searchArtists = query({
  args: {
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const searchLower = args.searchTerm.toLowerCase();
    
    // Get all active artists
    const artists = await ctx.db
      .query("artists")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Filter by search term
    const filtered = artists.filter((artist) => {
      return (
        artist.stageName.toLowerCase().includes(searchLower) ||
        artist.bio?.toLowerCase().includes(searchLower) ||
        artist.category.toLowerCase().includes(searchLower) ||
        artist.baseCity?.toLowerCase().includes(searchLower)
      );
    });

    // Apply limit
    const limited = args.limit ? filtered.slice(0, args.limit) : filtered;

    // Get user info
    const withUsers = await Promise.all(
      limited.map(async (artist) => {
        const user = await ctx.db.get(artist.userId);
        return {
          ...artist,
          user: user ? {
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
          } : null,
        };
      })
    );

    return withUsers;
  },
});