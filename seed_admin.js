import prisma from './src/config/prisma.js';

async function seed() {
  try {
    const admin = await prisma.admin.upsert({
      where: { email: 'admin@gigfactory.com' },
      update: {
        role: 'SUPER_ADMIN',
        isActive: true,
      },
      create: {
        name: 'Super Admin',
        email: 'admin@gigfactory.com',
        password: 'admin123', // In a real app, this should be hashed
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
    console.log('Super Admin seeded successfully:', admin);
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
