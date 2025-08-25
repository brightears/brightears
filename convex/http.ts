import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Clerk webhook handler
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return new Response("Webhook secret not configured", { status: 500 });
    }

    // Get the headers
    const svix_id = request.headers.get("svix-id");
    const svix_timestamp = request.headers.get("svix-timestamp");
    const svix_signature = request.headers.get("svix-signature");

    // If there are no SVIX headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occured -- no svix headers", { status: 400 });
    }

    // Get the body
    const payload = await request.text();

    // Create a new SVIX instance with your secret
    const wh = new Webhook(webhookSecret);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occured", { status: 400 });
    }

    // Handle the webhook
    const eventType = evt.type;
    
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const { id, email_addresses, first_name, last_name, image_url, phone_numbers } = evt.data;
        
        const email = email_addresses[0]?.email_address;
        if (!email) {
          return new Response("No email found", { status: 400 });
        }

        const phone = phone_numbers?.[0]?.phone_number;
        const name = [first_name, last_name].filter(Boolean).join(" ") || undefined;

        await ctx.runMutation(api.users.upsertFromClerk, {
          clerkId: id,
          email,
          name,
          imageUrl: image_url,
          phone,
        });
        break;
      }
      
      case "user.deleted": {
        // Handle user deletion if needed
        // For now, we'll keep the user data but you might want to mark as inactive
        console.log("User deleted:", evt.data.id);
        break;
      }
      
      case "session.created": {
        // Could be used to track user activity
        console.log("Session created for user:", evt.data.user_id);
        break;
      }
    }

    return new Response("Webhook processed", { status: 200 });
  }),
});

export default http;