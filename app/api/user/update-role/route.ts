import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await req.json();

    // Validate role
    if (!role || !Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update role in Clerk public metadata using clerkClient
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        role
      }
    });

    // Update role in database
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        artist: true,
        customer: true,
        corporate: true
      }
    });

    if (dbUser) {
      // Update existing user's role
      await prisma.user.update({
        where: { id: userId },
        data: { role }
      });

      // Create role-specific profile if it doesn't exist
      if (role === "ARTIST" && !dbUser.artist) {
        await prisma.artist.create({
          data: {
            userId,
            stageName: user.firstName || "Artist",
            category: "SINGER",
            baseCity: "Bangkok",
            languages: ["en", "th"]
          }
        });
      } else if (role === "CUSTOMER" && !dbUser.customer) {
        await prisma.customer.create({
          data: {
            userId,
            firstName: user.firstName || null,
            lastName: user.lastName || null,
            preferredLanguage: "en"
          }
        });
      } else if (role === "CORPORATE" && !dbUser.corporate) {
        await prisma.corporate.create({
          data: {
            userId,
            companyName: user.firstName || "Company",
            contactPerson: `${user.firstName} ${user.lastName}`.trim() || "Contact"
          }
        });
      }
    } else {
      // Create user if doesn't exist
      const userData: any = {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress,
        phone: user.phoneNumbers[0]?.phoneNumber || null,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        name: `${user.firstName} ${user.lastName}`.trim() || null,
        image: user.imageUrl || null,
        role,
        emailVerified: new Date(),
        lastLogin: new Date()
      };

      // Add role-specific profile
      if (role === "ARTIST") {
        userData.artist = {
          create: {
            stageName: user.firstName || "Artist",
            category: "SINGER",
            baseCity: "Bangkok",
            languages: ["en", "th"]
          }
        };
      } else if (role === "CUSTOMER") {
        userData.customer = {
          create: {
            firstName: user.firstName || null,
            lastName: user.lastName || null,
            preferredLanguage: "en"
          }
        };
      } else if (role === "CORPORATE") {
        userData.corporate = {
          create: {
            companyName: user.firstName || "Company",
            contactPerson: `${user.firstName} ${user.lastName}`.trim() || "Contact"
          }
        };
      }

      await prisma.user.create({
        data: userData
      });
    }

    return NextResponse.json({
      success: true,
      message: "Role updated successfully",
      role
    });

  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        artist: true,
        customer: true,
        corporate: true
      }
    });

    if (!user) {
      return NextResponse.json({ role: "CUSTOMER" });
    }

    return NextResponse.json({
      role: user.role,
      hasProfile: !!(user.artist || user.customer || user.corporate)
    });

  } catch (error) {
    console.error("Error getting user role:", error);
    return NextResponse.json(
      { error: "Failed to get role" },
      { status: 500 }
    );
  }
}