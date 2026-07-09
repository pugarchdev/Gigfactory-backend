import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const staticLogos = [
  { name: 'microsoft', image: '/assets/microsoft-1.png' },
  { name: 'TCS', image: '/assets/tcs-2.png' },
  { name: 'Adani', image: '/assets/adani-3.png' },
  { name: 'Emaar', image: '/assets/emaar-6.png' },
  { name: 'EY', image: '/assets/ey-12.png' },
  { name: 'Salesforce', image: '/assets/salesforce-4.png' },
  { name: 'Mastercard', image: '/assets/mastercard-5.png' },
  { name: 'gulfislamic', image: '/assets/gulfislamic-7.png' },
  { name: 'uiidb', image: '/assets/uiidb-9.png' },
  { name: 'Atkins', image: '/assets/atkins-8.png' },
  { name: 'Schneider', image: '/assets/schneider-10.png' },
  { name: 'jacobs', image: '/assets/jacobs-11.png' },
  { name: 'lt1', image: '/assets/lt-13.png' },
  { name: 'modon', image: '/assets/modon-15.png' },
  { name: 'peninsula', image: '/assets/penensula group.png' },
  { name: 'creative_luxury', image: '/assets/creative_luxury-16.png' },
  { name: 'natash', image: '/assets/natash-17.png' },
  { name: 'spa', image: '/assets/spa-18.png' },
  { name: 'Exotic', image: '/assets/Exotic-20.png' },
  { name: 'XGroup', image: '/assets/XGroup.png' },
  { name: 'SterlingWilson', image: '/assets/SterlingWilson.jpeg' },
  { name: 'BlueStar', image: '/assets/BlueStar.png' },
  { name: 'Labindia', image: '/assets/labindia-34.png' },
  { name: 'AMs', image: '/assets/AMs-19.png' },
  { name: 'fcd', image: '/assets/FCD.webp', logoMaxHeight: '75px' },
  { name: 'Aesthetic', image: '/assets/Aesthetic-23.png' },
  { name: 'mmoser', image: '/assets/mmoser-22.png' },
  { name: 'EDIFICE', image: '/assets/EDIFICE-25.png' },
  { name: 'HOSMAC', image: '/assets/HOSMAC-24.png' },
  { name: 'westbridge', image: '/assets/westbridge-21.png' },
  { name: 'Claramont', image: '/assets/claramont-45.png' },
  { name: 'sk', image: '/assets/sk-30.png' },
  { name: 'DH', image: '/assets/DH-41.png' },
  { name: 'denkall', image: '/assets/denkall-43.png' },
  { name: 'jmbaxi', image: '/assets/jmbaxi-35.png' },
  { name: 'orchid', image: '/assets/orchid-32.png' },
  { name: 'skillbind', image: '/assets/skillbind-29.png' },
  { name: 'ascenders', image: '/assets/ascenders-47.png' },
  { name: 'freespanz', image: '/assets/fsz-l6 2 (1).png' },
  { name: 'gilly', image: '/assets/gilly-l1 1.png' },
  { name: 'imagegrafix', image: '/assets/ig-l5 1.png' },
  { name: 'oarchilos', image: '/assets/oarchilos-l2 1.png' },
  { name: 'turnkey', image: '/assets/turnkey-49.png' },
  { name: 'suresh_babu_and_partners', image: '/assets/sbp-l4 1.png' },
  { name: 'Designworks', image: '/assets/Designworks-42.png' },
  { name: 'TGE', image: '/assets/TGE-27.png' },
  { name: 'GBArchitect', image: '/assets/GBArchitect-39.png' },
  { name: 'Sanderson', image: '/assets/Sanderson-31.png' },
  { name: 'Cynosure', image: '/assets/cynosure-44.png' },
  { name: 'ans', image: '/assets/ans-48.png' },
  { name: 'Au', image: '/assets/Au-46.png' },
  { name: 'DesignHouse', image: '/assets/DesignHouse-26.png' },
  { name: 'genesis', image: '/assets/genesis-l3 1.png' }
];

async function main() {
  console.log('Seeding static logos into database...');

  const gap = 16384;

  for (let i = 0; i < staticLogos.length; i++) {
    const logo = staticLogos[i];
    
    // Generate valid unique slug
    const slug = logo.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
      
    const priority = (i + 1) * gap;

    await prisma.media.upsert({
      where: { slug },
      update: {
        title: logo.name,
        image: logo.image,
        priority: priority,
        logoMaxHeight: logo.logoMaxHeight || null,
        logoMaxWidth: logo.logoMaxWidth || null,
      },
      create: {
        type: 'logo',
        title: logo.name,
        slug: slug,
        image: logo.image,
        priority: priority,
        summary: `Logo for ${logo.name}`,
        content: `Logo image for ${logo.name}`,
        status: 'published',
        images: [],
        logoMaxHeight: logo.logoMaxHeight || null,
        logoMaxWidth: logo.logoMaxWidth || null,
      }
    });
  }

  console.log(`Seeded ${staticLogos.length} logos successfully!`);

  console.log('Seeding FAQs into database...');
  const faqsData = [
    {
      q: "How does the GigScore system work for GigExperts on Gigfactory?",
      a: "The GigScore system helps gigowners choose the right GigExpert. It is based on Gigfactory’s vetting process and ratings from previous projects. It considers qualifications, portfolio, and feedback. Higher GigScore means more experienced and qualified experts."
    },
    {
      q: "How long does it take to complete a project on GigFactory?",
      a: "Project timelines vary based on scope and availability. It can range from one day to a year. Clear milestones and timelines help ensure timely completion. The platform also provides real-time tracking."
    },
    {
      q: "How do I make sure that my project stays within budget on Gigfactory?",
      a: "Clearly define scope, expectations, and outputs. Break the project into milestones for better tracking and cost control."
    },
    {
      q: "What happens if I'm not satisfied with the work delivered?",
      a: "You can communicate with the GigExpert to resolve issues. If unresolved, Gigfactory provides a dispute resolution process."
    },
    {
      q: "How can I ensure confidentiality of my project?",
      a: "Gigfactory enforces strict confidentiality policies, NDAs, and secure encrypted communication tools."
    },
    {
      q: "How can I track project progress?",
      a: "You can track milestones, communicate, share files, and request updates including video meetings."
    },
    {
      q: "Is there a limit to number of projects?",
      a: "No, you can post unlimited projects and work with multiple GigExperts."
    },
    {
      q: "Can I work with the same GigExpert on multiple projects?",
      a: "Yes, you can collaborate with the same expert across multiple projects and even mark them as preferred."
    },
    {
      q: "How do I ensure project quality and timely completion?",
      a: "Gigfactory vets experts, provides communication tools, and uses escrow payments to ensure quality and timely delivery."
    },
    {
      q: "How long does it take to find a suitable GigExpert?",
      a: "It depends on project scope, but GigScore helps you quickly find the best match."
    },
    {
      q: "Can I work with multiple GigExperts?",
      a: "Yes, you can assign different experts to different tasks or project stages."
    },
    {
      q: "Can I cancel a project?",
      a: "Yes, but completed milestone payments will be released to the expert. Always communicate before cancellation."
    }
  ];

  await prisma.fAQ.deleteMany({});
  for (const faq of faqsData) {
    await prisma.fAQ.create({
      data: faq
    });
  }
  console.log(`Seeded ${faqsData.length} FAQs successfully!`);
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
