import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedTestData() {
  console.log('🌱 Seeding premium test data...');

  // 1. Seed Agency Application
  const agency = await prisma.agencyApplication.create({
    data: {
      companyName: 'BIM Masters Global',
      authorizedPerson: 'John Architect',
      designation: 'Managing Partner',
      headquarters: 'Dubai, UAE',
      website: 'https://bimmasters.com',
      gstNumber: '22AAAAA0000A1Z5',
      pan: 'ABCDE1234F',
      providesBIM: true,
      providesAsBuiltAudit: true,
      bimSoftwares: ['REVIT', 'NAVISWORKS'],
      lodCapability: 'LOD_400',
      equipmentOwned: ['LASER_SCANNER', 'DRONE'],
      serviceRadius: 'NATIONWIDE',
      commercialBasis: 'LUMP_SUM',
      baseRate: 50000,
      leadTime: 'ONE_WEEK',
      isVerified: true,
      signature: 'John Architect',
      status: 'PENDING'
    }
  });

  // 2. Seed Freelancer Application
  await prisma.freelancerApplication.create({
    data: {
      fullName: 'Rahul Structural',
      designation: 'Senior Structural Engineer',
      location: 'Pune, India',
      linkedinUrl: 'https://linkedin.com/in/rahul-structural',
      legalName: 'Rahul Sharma',
      pan: 'ABCDE5678F',
      providesPeerReview: true,
      providesBOQ: true,
      specialization: 'STRUCTURAL',
      totalExperience: 8,
      measurementStandard: 'IS_1200',
      commercialBasis: 'HOURLY',
      baseRate: 1500,
      leadTime: 'IMMEDIATE',
      availability: 'PROJECT_BASIS',
      isVerified: true,
      signature: 'Rahul Sharma',
      status: 'PENDING'
    }
  });

  // 3. Seed GigExpert Feedback
  await prisma.gigExpertFeedback.create({
    data: {
      name: 'Sarah Structural',
      expertType: 'Individual Expert',
      email: 'sarah@eng.com',
      phone: '98888 77777',
      location: 'London, UK',
      experience: '12+ Years',
      gigExpertTypes: ['Strategic Advisor', 'Technical Lead'],
      projectTypes: ['Hospitals', 'Infrastructure'],
      keyWorkAreas: 'Specialized in earthquake-resistant design and large-scale healthcare BIM coordination.',
      status: 'PENDING',
      teamSize: 'Solo',
      workGeography: 'International',
      teamComposition: 'Design Core',
      designOrBuild: 'Design'
    }
  });

  console.log('✅ Success! Premium data injected.');
}

seedTestData()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
