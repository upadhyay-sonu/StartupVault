import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Deal } from '../models/Deal';

dotenv.config();

const sampleDeals = [
  {
    title: 'Vercel Pro - 50% Off Annual',
    description: 'Deploy your Next.js apps with lightning-fast edge functions and global CDN. Get 50% discount on Pro tier for 1 year.',
    category: 'hosting',
    accessLevel: 'public' as const,
    discount: 50,
    discountType: 'percentage' as const,
    maxClaims: 150,
    currentClaims: 0,
    partner: {
      name: 'Vercel',
      logo: 'https://via.placeholder.com/100?text=Vercel',
      description: 'The platform for frontend developers',
      website: 'https://vercel.com',
    },
    terms: 'Valid for 12 months. Apply code at checkout. Not combinable with other offers. Full refund within 30 days.',
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Stripe - $500 Credit',
    description: 'Accept payments globally with industry-leading security. New businesses get $500 in processing credits.',
    category: 'payment',
    accessLevel: 'verified' as const,
    discount: 500,
    discountType: 'flat' as const,
    maxClaims: 50,
    currentClaims: 0,
    partner: {
      name: 'Stripe',
      logo: 'https://via.placeholder.com/100?text=Stripe',
      description: 'Payment processing for internet businesses',
      website: 'https://stripe.com',
    },
    terms: 'Valid for 12 months. Credits automatically applied. For new Stripe accounts only. Subject to verification.',
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Mixpanel - 3 Months Free',
    description: 'Product analytics for user behavior. Get 3 months free of Mixpanel Plus tier ($999 value).',
    category: 'analytics',
    accessLevel: 'verified' as const,
    discount: 3,
    discountType: 'flat' as const,
    maxClaims: 100,
    currentClaims: 0,
    partner: {
      name: 'Mixpanel',
      logo: 'https://via.placeholder.com/100?text=Mixpanel',
      description: 'Advanced product analytics',
      website: 'https://mixpanel.com',
    },
    terms: '3 free months of Plus tier. Must have verified startup status. Convert to paid after trial period.',
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Slack Pro - 40% Off Annual',
    description: 'Team communication platform with unlimited message history, advanced security, and integrations.',
    category: 'communication',
    accessLevel: 'public' as const,
    discount: 40,
    discountType: 'percentage' as const,
    maxClaims: 200,
    currentClaims: 0,
    partner: {
      name: 'Slack',
      logo: 'https://via.placeholder.com/100?text=Slack',
      description: 'Where work happens',
      website: 'https://slack.com',
    },
    terms: '40% off annual Pro plan. Applies to new workspaces only. Discount locked for 1 year.',
    expiresAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Figma Professional - 50% Off',
    description: 'Design and prototype tool for teams. Get 50% off Professional plan including unlimited projects and drafts.',
    category: 'design',
    accessLevel: 'public' as const,
    discount: 50,
    discountType: 'percentage' as const,
    maxClaims: 120,
    currentClaims: 0,
    partner: {
      name: 'Figma',
      logo: 'https://via.placeholder.com/100?text=Figma',
      description: 'Design platform for teams',
      website: 'https://figma.com',
    },
    terms: 'Applies to individual or team Professional plans. Limited to 1 team per discount code.',
    expiresAt: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Auth0 - $100/Month Free',
    description: 'Authentication platform with enterprise-grade security. Get $100 monthly credit for 6 months.',
    category: 'development',
    accessLevel: 'verified' as const,
    discount: 600,
    discountType: 'flat' as const,
    maxClaims: 75,
    currentClaims: 0,
    partner: {
      name: 'Auth0',
      logo: 'https://via.placeholder.com/100?text=Auth0',
      description: 'Secure identity for any application',
      website: 'https://auth0.com',
    },
    terms: '$100/month credit for 6 months. Verified startups only. First purchase after trial.',
    expiresAt: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Notion Teams - 3 Months Free',
    description: 'All-in-one workspace for notes, docs, wikis, and databases. Free Teams plan for 3 months.',
    category: 'productivity',
    accessLevel: 'public' as const,
    discount: 3,
    discountType: 'flat' as const,
    maxClaims: 300,
    currentClaims: 0,
    partner: {
      name: 'Notion',
      logo: 'https://via.placeholder.com/100?text=Notion',
      description: 'All-in-one workspace',
      website: 'https://notion.so',
    },
    terms: '3 free months of Teams plan. Must upgrade after trial. Works for new accounts.',
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Intercom - 50% Off Annual',
    description: 'Customer communication platform with messaging, bots, and help desk. 50% off first year.',
    category: 'communication',
    accessLevel: 'verified' as const,
    discount: 50,
    discountType: 'percentage' as const,
    maxClaims: 80,
    currentClaims: 0,
    partner: {
      name: 'Intercom',
      logo: 'https://via.placeholder.com/100?text=Intercom',
      description: 'Customer communication platform',
      website: 'https://intercom.com',
    },
    terms: '50% off first year on Starter or higher plans. Verified startups only.',
    expiresAt: new Date(Date.now() + 140 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Mailchimp Premium - 30% Off',
    description: 'Email marketing and automation. Get 30% discount on Premium plans for 12 months.',
    category: 'marketing',
    accessLevel: 'public' as const,
    discount: 30,
    discountType: 'percentage' as const,
    maxClaims: 250,
    currentClaims: 0,
    partner: {
      name: 'Mailchimp',
      logo: 'https://via.placeholder.com/100?text=Mailchimp',
      description: 'Email marketing simplified',
      website: 'https://mailchimp.com',
    },
    terms: '30% off Premium plan for 12 months. Code applied at billing. New accounts only.',
    expiresAt: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'GitHub Enterprise - $200 Credit',
    description: 'Secure code hosting with CI/CD. New startups get $200 credit toward Enterprise Cloud.',
    category: 'development',
    accessLevel: 'verified' as const,
    discount: 200,
    discountType: 'flat' as const,
    maxClaims: 60,
    currentClaims: 0,
    partner: {
      name: 'GitHub',
      logo: 'https://via.placeholder.com/100?text=GitHub',
      description: 'Where the world builds software',
      website: 'https://github.com',
    },
    terms: '$200 credit for Enterprise Cloud. Valid 12 months from activation. Verified startups only.',
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not defined');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing deals
    await Deal.deleteMany({});
    console.log('Cleared existing deals');

    // Insert sample deals
    const inserted = await Deal.insertMany(sampleDeals);
    console.log(`Successfully inserted ${inserted.length} deals`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
