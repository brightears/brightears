import { prisma } from '../lib/prisma';
import { hash } from 'bcryptjs';

/**
 * Create an admin user in the database
 * Run with: npx ts-node scripts/create-admin.ts
 */
async function createAdmin() {
  // CHANGE THIS to your actual email address used in Clerk
  const adminEmail = process.env.ADMIN_EMAIL || 'platzer.norbert@gmail.com';

  console.log(`Creating admin user for: ${adminEmail}`);

  try {
    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: { email: adminEmail }
    });

    if (existing) {
      if (existing.role === 'ADMIN') {
        console.log('✅ Admin user already exists with ADMIN role');
        return;
      }

      // Update existing user to ADMIN
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: 'ADMIN' }
      });
      console.log('✅ Updated existing user to ADMIN role');
      return;
    }

    // Create new admin user
    const user = await prisma.user.create({
      data: {
        email: adminEmail,
        password: await hash('admin-not-used-clerk-auth', 10),
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        emailVerified: new Date(),
      }
    });

    console.log('✅ Created admin user:', user.email);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
