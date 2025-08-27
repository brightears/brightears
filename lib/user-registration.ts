import { clerkClient } from "@clerk/nextjs/server";

export type UserRole = "ARTIST" | "CUSTOMER" | "CORPORATE" | "ADMIN";

/**
 * Set user role in Clerk metadata
 */
export async function setUserRole(userId: string, role: UserRole) {
  try {
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        role: role,
      },
    });
    
    console.log(`Set user ${userId} role to ${role}`);
    return true;
  } catch (error) {
    console.error("Error setting user role:", error);
    throw new Error("Failed to set user role");
  }
}

/**
 * Get user role from Clerk metadata
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return (user.publicMetadata?.role as UserRole) || "CUSTOMER";
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

/**
 * Create artist registration API endpoint helper
 */
export async function registerAsArtist(userId: string, artistData?: {
  stageName?: string;
  category?: string;
  baseCity?: string;
}) {
  try {
    // Set role in Clerk
    await setUserRole(userId, "ARTIST");
    
    // The database record will be created via webhook
    // when Clerk sends the user.updated event
    
    return true;
  } catch (error) {
    console.error("Error registering artist:", error);
    throw new Error("Failed to register as artist");
  }
}

/**
 * Client-side role setting (to be called from frontend)
 */
export async function updateUserRoleClient(role: UserRole) {
  try {
    const response = await fetch('/api/auth/update-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      throw new Error('Failed to update role');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}