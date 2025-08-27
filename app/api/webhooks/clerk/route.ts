import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url, phone_numbers, public_metadata } = evt.data;

    try {
      const email = email_addresses[0]?.email_address;
      const phone = phone_numbers[0]?.phone_number;
      const fullName = first_name && last_name ? `${first_name} ${last_name}` : (first_name || "");
      
      // Get role from metadata or default to CUSTOMER
      const role = (public_metadata?.role as UserRole) || "CUSTOMER";

      if (!email) {
        console.error("No email provided in webhook data");
        return new Response("Email required", { status: 400 });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { id } // In case we're storing clerk ID as user ID
          ]
        },
        include: {
          artist: true,
          customer: true,
          corporate: true
        }
      });

      if (existingUser) {
        // Update existing user
        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            email,
            phone,
            firstName: first_name || null,
            lastName: last_name || null,
            name: fullName || null,
            image: image_url || null,
            role,
            updatedAt: new Date(),
            lastLogin: new Date()
          }
        });
        console.log(`Updated user:`, updatedUser.email);
      } else {
        // Create new user with appropriate profile based on role
        const userData: any = {
          id, // Use Clerk ID as primary key
          email,
          phone,
          firstName: first_name || null,
          lastName: last_name || null,
          name: fullName || null,
          image: image_url || null,
          role,
          emailVerified: new Date(), // Clerk handles email verification
          lastLogin: new Date()
        };

        // Add role-specific profile creation
        if (role === "ARTIST") {
          userData.artist = {
            create: {
              stageName: fullName || first_name || "Artist",
              category: "SINGER", // Default category, user can change later
              baseCity: "Bangkok", // Default location
              languages: ["en", "th"]
            }
          };
        } else if (role === "CUSTOMER") {
          userData.customer = {
            create: {
              firstName: first_name || null,
              lastName: last_name || null,
              preferredLanguage: "en"
            }
          };
        } else if (role === "CORPORATE") {
          userData.corporate = {
            create: {
              companyName: fullName || "Company",
              contactPerson: fullName || first_name || "Contact"
            }
          };
        }

        const newUser = await prisma.user.create({
          data: userData,
          include: {
            artist: true,
            customer: true,
            corporate: true
          }
        });
        
        console.log(`Created new user:`, newUser.email, `with role:`, role);
      }
    } catch (error) {
      console.error(`Error handling ${eventType}:`, error);
      return new Response("Error processing webhook", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    
    try {
      // Soft delete - mark user as inactive instead of hard delete
      await prisma.user.update({
        where: { id },
        data: { isActive: false }
      });
      console.log(`User marked as inactive:`, id);
    } catch (error) {
      console.error(`Error handling user deletion:`, error);
      return new Response("Error processing webhook", { status: 500 });
    }
  }

  return new Response("", { status: 200 });
}