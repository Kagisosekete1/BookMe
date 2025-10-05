

import { Talent, Post, Reel, Conversation, Message, User, UserRole, Comment, LoginSession, Transaction, Job } from '../types';

const getVerificationTier = (rating: number): 'gold' | 'blue' | undefined => {
  if (rating >= 4.8) return 'gold';
  if (rating >= 3.5) return 'blue';
  return undefined;
};

// Helper to get a future date string
const getFutureDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};


export const TALENTS: Talent[] = [
  {
    id: '1',
    name: 'Sipho Moyo',
    profileImage: 'https://picsum.photos/seed/sipho/200',
    rating: 4.9,
    reviewsCount: 124,
    distance: 8,
    hustles: ['DJ', 'Wedding DJ', 'Amapiano', 'Event Music', 'MC'],
    skills: ['Live Mixing', 'Beatmatching', 'Crowd Reading', 'Serato DJ Pro'],
    bio: "JHB's finest DJ with 10+ years of experience. I bring the vibe to any event, specializing in Amapiano, House, and Kwaito classics.",
    portfolio: [
      { type: 'image', url: 'https://picsum.photos/seed/djgig1/400/600' },
      { type: 'video', url: 'vid1', thumbnail: 'https://picsum.photos/seed/djgigvid1/400/600' },
      { type: 'image', url: 'https://picsum.photos/seed/djgig2/400/600' },
      { type: 'image', url: 'https://picsum.photos/seed/djgig3/400/600' },
      { type: 'video', url: 'vid2', thumbnail: 'https://picsum.photos/seed/djgigvid2/400/600' },
    ],
    reviews: [{ reviewer: 'Jane D.', rating: 5, comment: 'Sipho was incredible! He played all the right songs.' }],
    verificationTier: getVerificationTier(4.9)
  },
  {
    id: '2',
    name: 'Thando Nkosi',
    profileImage: 'https://picsum.photos/seed/thando/200',
    rating: 4.7,
    reviewsCount: 88,
    distance: 15,
    hustles: ['Photographer', 'Event Photography', 'Portraits', 'Videography'],
    skills: ['Portrait Lighting', 'Adobe Lightroom', 'Wedding Shoots', 'Canon EOS R5'],
    bio: "Capturing moments that last a lifetime. Professional photography for weddings, corporate events, and personal portraits.",
    portfolio: [
        { type: 'image', url: 'https://picsum.photos/seed/photo1/400/600' },
        { type: 'image', url: 'https://picsum.photos/seed/photo2/400/600' },
        { type: 'image', url: 'https://picsum.photos/seed/photo3/400/600' },
    ],
    reviews: [{ reviewer: 'John S.', rating: 5, comment: 'Amazing photos, very professional.' }],
    verificationTier: getVerificationTier(4.7)
  },
  {
    id: '3',
    name: 'Lethabo Khumalo',
    profileImage: 'https://picsum.photos/seed/lethabo/200',
    rating: 5.0,
    reviewsCount: 95,
    distance: 5,
    hustles: ['Makeup Artist', 'Bridal Makeup', 'Special Effects', 'MUA'],
    skills: ['Bridal Makeup', 'Airbrushing', 'Contouring', 'Skincare Prep'],
    bio: "Certified makeup artist specializing in bridal and event makeup. Let's create your perfect look.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/mua1/400/600' }],
    reviews: [{ reviewer: 'Sarah P.', rating: 5, comment: 'Felt so beautiful on my wedding day!' }],
    verificationTier: getVerificationTier(5.0)
  },
  {
    id: '4',
    name: 'Bongani Zulu',
    profileImage: 'https://picsum.photos/seed/bongani/200',
    rating: 3.2,
    reviewsCount: 210,
    distance: 22,
    hustles: ['Bakkie for Hire', 'Furniture Removal', 'Moving Services', 'Logistics'],
    skills: ['Safe Loading', 'Route Planning', 'Heavy Lifting', 'Customer Service'],
    bio: "Reliable and affordable moving services. No job is too big or too small. Your friendly neighborhood hustler.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/bakkie1/400/600' }],
    reviews: [{ reviewer: 'Mike R.', rating: 4, comment: 'Good service, but arrived a bit late.' }],
    verificationTier: getVerificationTier(3.2)
  },
  {
    id: '5',
    name: 'Ayanda Dlamini',
    profileImage: 'https://picsum.photos/seed/ayanda/200',
    rating: 4.8,
    reviewsCount: 76,
    distance: 12,
    hustles: ['Catering', 'Event Catering', 'Custom Cakes', 'Private Chef'],
    skills: ['Menu Planning', 'Food Plating', 'Bulk Cooking', 'Pastry Chef'],
    bio: "Delicious food for any occasion. From custom cakes to full-service event catering, we've got you covered.",
    portfolio: [
        { type: 'image', url: 'https://picsum.photos/seed/cake1/400/600' },
        { type: 'image', url: 'https://picsum.photos/seed/food1/400/600' },
    ],
    reviews: [{ reviewer: 'Emily T.', rating: 5, comment: 'The food was the highlight of our party!' }],
    verificationTier: getVerificationTier(4.8)
  },
  {
    id: '6',
    name: 'Zola Williams',
    profileImage: 'https://picsum.photos/seed/zola/200',
    rating: 4.9,
    reviewsCount: 150,
    distance: 18,
    hustles: ['Wedding Planner', 'Event Coordinator', 'Decor', 'Luxury Weddings'],
    skills: ['Vendor Management', 'Budgeting', 'Day-of Coordination', 'Styling'],
    bio: "Crafting unforgettable weddings with meticulous planning and creative design. Let's make your dream day a reality.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/wedding1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(4.9)
  },
  {
    id: '7',
    name: 'Themba Johnson',
    profileImage: 'https://picsum.photos/seed/themba/200',
    rating: 3.8,
    reviewsCount: 45,
    distance: 3,
    hustles: ['Graphic Designer', 'Logo Design', 'Branding', 'Illustrator'],
    skills: ['Adobe Illustrator', 'Brand Identity', 'Typography', 'Figma'],
    bio: "Creative graphic designer helping brands stand out with unique logos and branding identities.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/design1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(3.8)
  },
  {
    id: '8',
    name: 'Khanya Cele',
    profileImage: 'https://picsum.photos/seed/khanya/200',
    rating: 4.2,
    reviewsCount: 62,
    distance: 25,
    hustles: ['Personal Trainer', 'Fitness Coach', 'Nutritionist', 'Online Coaching'],
    skills: ['Strength Training', 'HIIT', 'Meal Planning', 'Functional Fitness'],
    bio: "Certified personal trainer dedicated to helping you reach your fitness goals. Personalized workout and nutrition plans.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/fitness1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(4.2)
  },
  {
    id: '9',
    name: 'Lesedi Mokoena',
    profileImage: 'https://picsum.photos/seed/lesedi/200',
    rating: 4.6,
    reviewsCount: 110,
    distance: 9,
    hustles: ['Social Media Manager', 'Content Creator', 'Digital Marketing', 'Influencer'],
    skills: ['Content Strategy', 'Community Management', 'SEO', 'Meta Ads'],
    bio: "Driving growth for brands through strategic social media management and engaging content creation.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/social1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(4.6)
  },
  {
    id: '10',
    name: 'David Chen',
    profileImage: 'https://picsum.photos/seed/david/200',
    rating: 5.0,
    reviewsCount: 180,
    distance: 14,
    hustles: ['Mobile App Developer', 'iOS', 'Android', 'React Native'],
    skills: ['Swift', 'Kotlin', 'React Native', 'Firebase'],
    bio: "Experienced mobile developer building high-quality iOS and Android applications for startups and enterprises.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/appdev1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(5.0)
  },
  {
    id: '11',
    name: 'Amahle Gumede',
    profileImage: 'https://picsum.photos/seed/amahle/200',
    rating: 3.9,
    reviewsCount: 33,
    distance: 7,
    hustles: ['Fashion Designer', 'Custom Tailoring', 'Stylist'],
    skills: ['Pattern Making', 'Garment Construction', 'Styling', 'Textiles'],
    bio: "Creating bespoke garments that celebrate individuality. From concept to creation, your style journey starts here.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/fashion1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(3.9)
  },
  {
    id: '12',
    name: 'Mandla Ndlovu',
    profileImage: 'https://picsum.photos/seed/mandla/200',
    rating: 3.4,
    reviewsCount: 91,
    distance: 30,
    hustles: ['Landscaper', 'Gardening Services', 'Irrigation'],
    skills: ['Garden Design', 'Planting', 'Irrigation Systems', 'Lawn Care'],
    bio: "Transforming outdoor spaces into beautiful, sustainable gardens. Professional landscaping and maintenance.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/garden1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(3.4)
  },
  {
    id: '13',
    name: 'Lucas Radebe Jr.',
    profileImage: 'https://picsum.photos/seed/lucas/200',
    rating: 4.8,
    reviewsCount: 250,
    distance: 1,
    hustles: ['Soccer Player', 'Skills Coach', 'Pro Athlete', 'Motivational Speaker'],
    skills: ['Dribbling', 'Shooting', 'Youth Coaching', 'Public Speaking'],
    bio: "Professional soccer player and youth skills coach. Sharing my passion for the beautiful game.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/soccer1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(4.8)
  },
  {
    id: '14',
    name: 'Neo Beats',
    profileImage: 'https://picsum.photos/seed/neo/200',
    rating: 4.9,
    reviewsCount: 190,
    distance: 11,
    hustles: ['Music Producer', 'Beatmaker', 'Sound Engineer', 'Amapiano Beats'],
    skills: ['FL Studio', 'Mixing & Mastering', 'Sound Design', 'Amapiano'],
    bio: "Crafting chart-topping beats for artists across genres. Specializing in Amapiano, Hip Hop, and R&B.",
    portfolio: [{ type: 'video', url: 'vid4', thumbnail: 'https://picsum.photos/seed/beatsvid1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(4.9)
  },
  {
    id: '15',
    name: 'Chloe Botha',
    profileImage: 'https://picsum.photos/seed/chloe/200',
    rating: 4.1,
    reviewsCount: 55,
    distance: 16,
    hustles: ['Interior Designer', 'Home Staging', 'Decor Consultant'],
    skills: ['Space Planning', 'Color Theory', '3D Rendering', 'AutoCAD'],
    bio: "Creating beautiful and functional living spaces that reflect your personality. Full-service interior design.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/interior1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(4.1)
  },
  {
    id: '16',
    name: 'Benny McCarthy',
    profileImage: 'https://picsum.photos/seed/benny/200',
    rating: 3.6,
    reviewsCount: 80,
    distance: 2,
    hustles: ['Comedian', 'MC', 'Corporate Entertainment'],
    skills: ['Stand-up Comedy', 'Improvisation', 'MCing', 'Script Writing'],
    bio: "Bringing laughter to stages across the country. Available for corporate events, comedy nights, and MC duties.",
    portfolio: [{ type: 'video', url: 'vid5', thumbnail: 'https://picsum.photos/seed/comedyvid1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(3.6)
  },
  {
    id: '17',
    name: 'Fatima Omar',
    profileImage: 'https://picsum.photos/seed/fatima/200',
    rating: 5.0,
    reviewsCount: 130,
    distance: 20,
    hustles: ['Henna Artist', 'Bridal Henna', 'Mehndi'],
    skills: ['Intricate Designs', 'Natural Henna', 'Bridal Mehndi', 'Jagua Tattoos'],
    bio: "Intricate and beautiful henna designs for weddings, festivals, and special occasions. Using 100% natural henna.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/henna1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(5.0)
  },
  {
    id: '18',
    name: 'Ryan van der Merwe',
    profileImage: 'https://picsum.photos/seed/ryan/200',
    rating: 3.3,
    reviewsCount: 68,
    distance: 28,
    hustles: ['Carpenter', 'Custom Furniture', 'Woodworking'],
    skills: ['Joinery', 'Cabinet Making', 'Wood Finishing', 'Custom Design'],
    bio: "Skilled carpenter creating custom furniture and bespoke woodworking pieces. Quality craftsmanship that lasts.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/wood1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(3.3)
  },
  {
    id: '19',
    name: 'Naledi Sithole',
    profileImage: 'https://picsum.photos/seed/naledi/200',
    rating: 4.7,
    reviewsCount: 102,
    distance: 6,
    hustles: ['Voice-over Artist', 'Narrator', 'Podcast Host'],
    skills: ['Voice Acting', 'Narration', 'Audio Editing', 'Character Voices'],
    bio: "Professional voice-over artist with a versatile voice. Available for commercials, narration, and podcasts.",
    portfolio: [{ type: 'video', url: 'vid6', thumbnail: 'https://picsum.photos/seed/voicevid1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(4.7)
  },
  {
    id: '20',
    name: 'Pieter Naude',
    profileImage: 'https://picsum.photos/seed/pieter/200',
    rating: 3.1,
    reviewsCount: 40,
    distance: 21,
    hustles: ['Plumber', 'Emergency Plumbing', 'Geyser Installation'],
    skills: ['Pipe Fitting', 'Drain Cleaning', 'Geyser Repair', '24/7 Service'],
    bio: "Reliable 24/7 plumbing services. From leaky taps to geyser installations, no job is too small.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/plumber1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(3.1)
  },
  {
    id: '21',
    name: 'Grace Kim',
    profileImage: 'https://picsum.photos/seed/grace/200',
    rating: 4.8,
    reviewsCount: 85,
    distance: 13,
    hustles: ['Tutor', 'Maths & Science', 'Online Tutoring'],
    skills: ['Mathematics', 'Physical Science', 'Exam Prep', 'Zoom Tutoring'],
    bio: "Experienced tutor helping students excel in Maths and Science. Personalized lessons to build confidence.",
    portfolio: [],
    reviews: [],
    verificationTier: getVerificationTier(4.8)
  },
  {
    id: '22',
    name: "Tshepo 'The Chef' Masango",
    profileImage: 'https://picsum.photos/seed/tshepo/200',
    rating: 4.9,
    reviewsCount: 115,
    distance: 19,
    hustles: ['Private Chef', 'Fine Dining', 'Cooking Classes'],
    skills: ['French Cuisine', 'Wine Pairing', 'Pastry', 'Event Catering'],
    bio: "Bringing the fine dining experience to your home. Curated menus for intimate dinners and special events.",
    portfolio: [{ type: 'image', url: 'https://picsum.photos/seed/chef1/400/600' }],
    reviews: [],
    verificationTier: getVerificationTier(4.9)
  },
  ...Array.from({ length: 30 }, (_, i) => {
      const id = 23 + i;
      const rating = 3.0 + (i % 21) / 10; // generates ratings between 3.0 and 5.0
      const professions = [
        { hustles: ['Yoga Instructor', 'Wellness', 'Meditation'], skills: ['Vinyasa', 'Meditation', 'Pranayama'] },
        { hustles: ['Web Developer', 'Frontend', 'Backend', 'React'], skills: ['React', 'Node.js', 'TypeScript'] },
        { hustles: ['Electrician', 'Home Wiring', 'Repairs'], skills: ['Wiring', 'Fault Finding', 'COC'] },
        { hustles: ['Dog Walker', 'Pet Sitter'], skills: ['Dog Handling', 'First Aid', 'Pet Care'] },
        { hustles: ['Translator', 'English-isiZulu', 'Documents'], skills: ['Translation', 'Proofreading', 'Localization'] },
        { hustles: ['Event Security', 'Bouncer', 'Crowd Control'], skills: ['Crowd Management', 'Access Control'] },
        { hustles: ['Barista', 'Specialty Coffee'], skills: ['Latte Art', 'Espresso Making', 'Bean Knowledge'] },
        { hustles: ['Videographer', 'Drone Pilot', 'Wedding Videos'], skills: ['Video Editing', 'Drone Operation', 'Color Grading'] },
        { hustles: ['Painter', 'Home Painting', 'Art Commission'], skills: ['Interior Painting', ' murals', 'Commissioned Art'] },
        { hustles: ['Musician', 'Guitarist', 'Singer', 'Live Music'], skills: ['Acoustic Guitar', 'Vocals', 'Live Performance'] },
        { hustles: ['Accountant', 'Tax Returns', 'Bookkeeping'], skills: ['Tax', 'Bookkeeping', 'Financial Statements'] },
        { hustles: ['Baker', 'Artisan Bread', 'Pastries'], skills: ['Sourdough', 'Croissants', 'Cake Decorating'] },
        { hustles: ['Cleaner', 'Home Cleaning', 'Office Cleaning'], skills: ['Deep Cleaning', 'Organization', 'Eco-friendly'] },
        { hustles: ['Florist', 'Wedding Flowers', 'Bouquets'], skills: ['Floral Arrangements', 'Wedding Decor', 'Bouquets'] },
        { hustles: ['Mechanic', 'Car Service', 'Repairs'], skills: ['Engine Diagnostics', 'Servicing', 'Brake Repairs'] },
        { hustles: ['Animator', '2D Animation', 'Motion Graphics'], skills: ['After Effects', 'Character Animation', 'Toon Boom'] },
        { hustles: ['Locksmith', 'Key Cutting', 'Emergency Locksmith'], skills: ['Lock Picking', 'Key Duplication', '24/7 Service'] },
        { hustles: ['Tailor', 'Alterations', 'Custom Suits'], skills: ['Suit Fitting', 'Alterations', 'Dressmaking'] },
        { hustles: ['Life Coach', 'Career Coaching', 'Personal Growth'], skills: ['Goal Setting', 'Mindfulness', 'Career Advice'] },
        { hustles: ['Driving Instructor', 'K53', 'Learners License'], skills: ['K53 Method', 'Patient Instruction', 'Defensive Driving'] },
        { hustles: ['Consultant', 'Business Strategy'], skills: ['Market Analysis', 'Business Planning', 'Growth Strategy'] },
        { hustles: ['Architect', 'Building Plans', 'Renovations'], skills: ['AutoCAD', '3D Modeling', 'Residential Design'] },
        { hustles: ['Lawyer', 'Legal Advice', 'Contracts'], skills: ['Contract Law', 'Litigation', 'Family Law'] },
        { hustles: ['Babysitter', 'Childcare'], skills: ['Early Childhood Development', 'First Aid', 'CPR'] },
        { hustles: ['Nutritionist', 'Meal Plans', 'Dietary Advice'], skills: ['Diet Planning', 'Sports Nutrition', 'Wellness'] },
        { hustles: ['Copywriter', 'Marketing Copy', 'Content Writing'], skills: ['SEO Copywriting', 'Ad Copy', 'Blogging'] },
        { hustles: ['Podcaster', 'Audio Editing', 'Show Host'], skills: ['Audacity', 'Interviewing', 'Storytelling'] },
        { hustles: ['Travel Agent', 'Holiday Packages', 'Flights'], skills: ['Itinerary Planning', 'Booking Systems', 'Travel Deals'] },
        { hustles: ['Real Estate Agent', 'Property Sales', 'Rentals'], skills: ['Negotiation', 'Property Valuation', 'Sales'] },
        { hustles: ['Event MC', 'Host', 'Public Speaking'], skills: ['Public Speaking', 'Hosting', 'Event Coordination'] },
      ];
      const selectedProfession = professions[i % professions.length];
      return {
        id: `${id}`,
        name: `User ${id}`,
        profileImage: `https://picsum.photos/seed/user${id}/200`,
        rating: parseFloat(rating.toFixed(1)),
        reviewsCount: 10 + (i * 5) % 100,
        distance: 2 + (i * 3) % 28,
        hustles: selectedProfession.hustles,
        skills: selectedProfession.skills,
        bio: `A passionate and reliable ${selectedProfession.hustles[0]} looking for new opportunities.`,
        portfolio: [{ type: 'image' as 'image' | 'video', url: `https://picsum.photos/seed/portfolio${id}/400/600` }],
        reviews: [],
        verificationTier: getVerificationTier(rating)
      };
  })
];

export let JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Wedding DJ needed for Saturday night event',
    clientId: 'client-sarah-p',
    location: 'Stellenbosch, WC',
    budget: 5000,
    description: 'Looking for an experienced wedding DJ to play a mix of popular hits and classics for a wedding reception of 100 guests. Must have own equipment.',
    requiredProfession: 'DJ'
  },
  {
    id: 'j2',
    title: 'Corporate Headshots for Startup Team',
    clientId: 'client-john-s',
    location: 'Sandton, JHB',
    budget: 3500,
    description: 'We need professional headshots for our team of 10 employees. Clean, modern style required. Please provide a portfolio.',
    requiredProfession: 'Photographer'
  },
  {
    id: 'j3',
    title: 'Bridal Makeup for Wedding Party',
    clientId: 'client-jane-d',
    location: 'Durban, KZN',
    budget: 2500,
    description: 'Seeking a talented makeup artist for a bride and three bridesmaids. Trial session required before the wedding day.',
    requiredProfession: 'Makeup Artist'
  },
  {
    id: 'j4',
    title: 'Amapiano Producer for single track',
    clientId: 'client-premium-records',
    location: 'Remote',
    budget: 8000,
    description: 'Upcoming artist looking for a skilled Amapiano producer to collaborate on a new single. Must have a proven track record.',
    requiredProfession: 'Music Producer'
  },
  {
    id: 'j5',
    title: 'Kids Party Catering for 30 children',
    clientId: 'client-emily-t',
    location: 'Pretoria, GP',
    budget: 4000,
    description: 'Need fun, kid-friendly catering for a 10th birthday party. Please provide menu options. Nut-free is a must.',
    requiredProfession: 'Catering'
  },
  {
    id: 'j6',
    title: 'Urgent: Wedding Photographer for this weekend',
    clientId: 'client-mike-r',
    location: 'Cape Town, WC',
    budget: 10000,
    description: 'Our photographer cancelled last minute! We need a professional to cover our wedding this Saturday. Full day coverage needed.',
    requiredProfession: 'Photographer'
  },
  {
    id: 'j7',
    title: 'MC for Corporate Awards Gala',
    clientId: 'client-corporate-events',
    location: 'Sandton, JHB',
    budget: 7500,
    description: 'Seeking a professional and charismatic MC to host our annual awards gala. Experience with corporate events is essential.',
    requiredProfession: 'DJ' // MC falls under DJ
  },
  ...Array.from({ length: 50 }, (_, i) => {
    const jobTypes = [
        { profession: 'Photographer', title: 'Product Photoshoot for E-commerce Store' },
        { profession: 'Makeup Artist', title: 'Makeup for Matric Dance' },
        { profession: 'DJ', title: 'House Party DJ for 21st Birthday' },
        { profession: 'Catering', title: 'Private Dinner for Two Anniversary' },
        { profession: 'Music Producer', title: 'Hip Hop Beat for EP' },
        { profession: 'Wedding Planner', title: 'Day-of Coordinator for Small Wedding' },
        { profession: 'Graphic Designer', title: 'New Logo for a Local Cafe' },
        { profession: 'Personal Trainer', title: '8-Week Fitness Transformation Package' },
        { profession: 'Social Media Manager', title: 'Manage Instagram for a Fashion Brand' },
        { profession: 'Mobile App Developer', title: 'Build a Simple Prototype App' },
        { profession: 'Fashion Designer', title: 'Design a Custom Graduation Dress' },
        { profession: 'Landscaper', title: 'Garden Cleanup and Redesign' },
        { profession: 'Soccer Player', title: 'Youth Soccer Clinic Coach' },
        { profession: 'Comedian', title: 'Stand-up Set for a Birthday Party' },
        { profession: 'Henna Artist', title: 'Henna for a Bridal Shower' },
        { profession: 'Carpenter', title: 'Build Custom Bookshelves' },
        { profession: 'Voice-over Artist', title: 'Voiceover for a 2-min Explainer Video' },
        { profession: 'Plumber', title: 'Fix Leaky Kitchen Sink' },
        { profession: 'Tutor', title: 'Weekly Grade 11 Maths Tutoring' },
        { profession: 'Private Chef', title: 'Weekly Meal Prep Service' },
    ];
    const job = jobTypes[i % jobTypes.length];
    const clientIds = ['client-corporate-events', 'client-premium-records', 'client-jane-d', 'client-john-s', `client-new-${i}`];
    
    return {
        id: `j${8 + i}`,
        title: job.title,
        clientId: clientIds[i % clientIds.length],
        location: ['Cape Town, WC', 'Johannesburg, GP', 'Durban, KZN', 'Pretoria, GP'][i % 4],
        budget: 1000 + (i * 150) % 8000,
        description: `We are looking for a skilled ${job.profession} for an upcoming project. Please apply with your portfolio and rates.`,
        requiredProfession: job.profession,
    };
  })
];

export let POSTS: Post[] = [
    {
    id: 'p1',
    talentId: '1',
    text: "Just wrapped up an amazing wedding gig in Sandton! The dance floor was on fire all night. 🔥 Need a DJ for your event? You know who to call!",
    imageUrl: 'https://picsum.photos/seed/post1/600/400',
    likes: 152,
    commentsCount: 2,
    timestamp: '2h ago',
    music: 'Amapiano - Asibe Happy',
    comments: [
        { id: 'c1-1', user: 'Thando Nkosi', userId: '2', profileImage: 'https://picsum.photos/seed/thando/200', text: 'Looks amazing! 🔥', likes: 12, isLiked: true},
        { id: 'c1-2', user: 'Ayanda Dlamini', userId: '5', profileImage: 'https://picsum.photos/seed/ayanda/200', text: 'Vibes!', likes: 5, isLiked: false},
    ],
  },
  {
    id: 'p2',
    talentId: '3',
    text: "Loved creating this stunning bridal look for a client this morning. That glow is everything! ✨ #BridalMakeup #MUA",
    imageUrl: 'https://picsum.photos/seed/post2/600/400',
    likes: 230,
    commentsCount: 1,
    timestamp: '5h ago',
    music: 'Wedding - Romantic Ballad',
    comments: [
        { id: 'c2-1', user: 'Zola Williams', userId: '6', profileImage: 'https://picsum.photos/seed/zola/200', text: 'Absolutely stunning, Lethabo!', likes: 22, isLiked: true},
    ],
  },
    {
    id: 'p5',
    talentId: '2',
    text: "Golden hour hits different. Capturing some magic during a portrait session in the beautiful Cradle of Humankind.",
    imageUrl: 'https://picsum.photos/seed/post5/600/400',
    likes: 180,
    commentsCount: 0,
    timestamp: '8h ago',
    comments: [],
  },
  {
    id: 'p3',
    talentId: '4',
    text: "Another successful move done and dusted. From Cape Town to Pretoria, we handle your goods with care. Get in touch for a quote! 🚚",
    likes: 45,
    commentsCount: 1,
    timestamp: '1d ago',
    comments: [
         { id: 'c3-1', user: 'Test Client', userId: 'client-test', profileImage: 'https://picsum.photos/seed/client/200', text: 'Thanks for the great service!', likes: 2, isLiked: false},
    ],
  },
    {
    id: 'p6',
    talentId: '5',
    text: "Who needs a slice of heaven? This custom-designed red velvet cake was a showstopper at a 30th birthday party.",
    imageUrl: 'https://picsum.photos/seed/post6/600/400',
    likes: 350,
    commentsCount: 0,
    timestamp: '1d ago',
    music: 'Party - Upbeat Mix',
    comments: [],
  },
   {
    id: 'p4',
    talentId: '1',
    text: "New mix dropping this Friday! Get ready for some weekend vibes.",
    imageUrl: 'https://picsum.photos/seed/post4/600/400',
    likes: 310,
    commentsCount: 0,
    timestamp: '2d ago',
    comments: [],
  },
  {
    id: 'p7',
    talentId: '3',
    text: "Experimenting with some bold, editorial makeup looks in the studio today. Creativity has no limits!",
    likes: 120,
    commentsCount: 0,
    timestamp: '2d ago',
    comments: [],
  },
    {
    id: 'p8',
    talentId: '4',
    text: "Helping a student move into their new digs. We offer student discounts! #MovingServices #StudentLife",
    imageUrl: 'https://picsum.photos/seed/post8/600/400',
    likes: 25,
    commentsCount: 0,
    timestamp: '3d ago',
    comments: [],
  },
  {
    id: 'p9',
    talentId: '2',
    text: "The joy on their faces says it all. Wedding photography is more than just pictures, it's about capturing emotions.",
    imageUrl: 'https://picsum.photos/seed/post9/600/400',
    likes: 215,
    commentsCount: 0,
    timestamp: '3d ago',
    comments: [],
  },
  {
    id: 'p10',
    talentId: '1',
    text: "Throwback to that epic set at Ultra South Africa! Can't wait for the next one. #TBT #DJLife",
    imageUrl: 'https://picsum.photos/seed/post10/600/400',
    likes: 550,
    commentsCount: 0,
    timestamp: '4d ago',
    comments: [],
  },
  {
    id: 'p11',
    talentId: '5',
    text: "Corporate lunch for 100 people? No problem. Our team is prepped and ready to serve.",
    imageUrl: 'https://picsum.photos/seed/post11/600/400',
    likes: 95,
    commentsCount: 0,
    timestamp: '4d ago',
    music: 'Corporate - Focus Flow',
    comments: [],
  },
  {
    id: 'p12',
    talentId: '3',
    text: "Quick tip for flawless foundation: always prep your skin with a good moisturizer and primer!",
    likes: 400,
    commentsCount: 0,
    timestamp: '5d ago',
    comments: [],
  },
  {
    id: 'p13',
    talentId: '4',
    text: "Need to clear out some junk from your garage? We do junk removal too! Quick and efficient.",
    likes: 30,
    commentsCount: 0,
    timestamp: '5d ago',
    comments: [],
  },
  {
    id: 'p14',
    talentId: '2',
    text: "Just released a new videography showreel. Check it out on my portfolio! #Videographer",
    imageUrl: 'https://picsum.photos/seed/post14/600/400',
    likes: 130,
    commentsCount: 0,
    timestamp: '6d ago',
    comments: [],
  },
  {
    id: 'p15',
    talentId: '5',
    text: "Nothing beats the smell of freshly baked bread. Preparing for a private chef experience tonight.",
    imageUrl: 'https://picsum.photos/seed/post15/600/400',
    likes: 280,
    commentsCount: 0,
    timestamp: '6d ago',
    comments: [],
  },
  {
    id: 'p16',
    talentId: '1',
    text: "My gear is my baby. Keeping everything clean and ready for the next event.",
    likes: 180,
    commentsCount: 0,
    timestamp: '1w ago',
    comments: [],
  },
    {
    id: 'p17',
    talentId: '3',
    text: "Had a blast working on a music video shoot! Special effects makeup is my secret passion.",
    imageUrl: 'https://picsum.photos/seed/post17/600/400',
    likes: 320,
    commentsCount: 0,
    timestamp: '1w ago',
    comments: [],
  },
  {
    id: 'p18',
    talentId: '4',
    text: "Shoutout to all my clients for trusting me with their valuables. Your reviews mean the world to me!",
    likes: 60,
    commentsCount: 0,
    timestamp: '1w ago',
    comments: [],
  },
  {
    id: 'p19',
    talentId: '2',
    text: "Editing late into the night. The work behind the perfect shot is just as important as the shot itself.",
    likes: 90,
    commentsCount: 0,
    timestamp: '8d ago',
    comments: [],
  },
  {
    id: 'p20',
    talentId: '5',
    text: "Canapés and cocktails for a rooftop party. Summer events are the best!",
    imageUrl: 'https://picsum.photos/seed/post20/600/400',
    likes: 210,
    commentsCount: 0,
    timestamp: '9d ago',
    comments: [],
  },
  {
    id: 'p21',
    talentId: '1',
    text: "What's your favorite Amapiano track right now? Drop it in the comments!",
    imageUrl: 'https://picsum.photos/seed/post21/600/400',
    likes: 410,
    commentsCount: 0,
    timestamp: '10d ago',
    comments: [],
  }
];

export let REELS: Reel[] = [
    {
        id: 'r1',
        talentId: '1',
        videoUrl: 'vid1',
        caption: 'Bringing the Amapiano vibes! #DJ #Party',
        likes: 1200,
        commentsCount: 2,
        music: {
            title: 'Asibe Happy',
            artist: 'Kabza De Small & DJ Maphorisa'
        },
        comments: [
            { id: 'cr1-1', user: 'Neo Beats', userId: '14', profileImage: 'https://picsum.photos/seed/neo/200', text: 'This mix is fire!', likes: 25, isLiked: false},
            { id: 'cr1-2', user: 'Test Client', userId: 'client-test', profileImage: 'https://picsum.photos/seed/client/200', text: 'Need you for my next party!', likes: 8, isLiked: true},
        ],
    },
    {
        id: 'r2',
        talentId: '2',
        videoUrl: 'vid2',
        caption: 'Behind the scenes of a magical photoshoot.',
        likes: 850,
        commentsCount: 0,
        music: {
            title: 'Sunday Morning',
            artist: 'Chill Vibes Inc.'
        },
        comments: [],
    },
     {
        id: 'r3',
        talentId: '5',
        videoUrl: 'vid3',
        caption: 'The final touches on a beautiful wedding cake.',
        likes: 2500,
        commentsCount: 1,
        music: {
            title: 'Perfect Day',
            artist: 'Wedding Songs Crew'
        },
        comments: [
             { id: 'cr3-1', user: 'Zola Williams', userId: '6', profileImage: 'https://picsum.photos/seed/zola/200', text: 'I can\'t wait! It looks perfect.', likes: 15, isLiked: false},
        ],
    }
];

const now = new Date();
const yesterday = new Date();
yesterday.setDate(now.getDate() - 1);
const twoDaysAgo = new Date();
twoDaysAgo.setDate(now.getDate() - 2);
const threeDaysAgo = new Date();
threeDaysAgo.setDate(now.getDate() - 3);
const fourDaysAgo = new Date();
fourDaysAgo.setDate(now.getDate() - 4);

export let CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    talentId: '1',
    messages: [
      { id: 'm1', senderId: '1', text: 'Hey! Are you available for a gig on the 25th?', timestamp: 'Yesterday' },
      { id: 'm2', senderId: 'me', text: 'Hi Sipho, yes I am! What are the details?', timestamp: 'Yesterday' },
      { id: 'm3', senderId: '1', text: 'It\'s a corporate event in Sandton. From 7pm till late. Can you do it?', timestamp: '10:32 AM' },
    ],
    lastMessage: 'It\'s a corporate event in Sandton. From 7pm till late. Can you do it?',
    lastMessageTimestamp: '10:32 AM',
    lastMessageDate: now,
    unreadCount: 1,
  },
  {
    id: 'c2',
    talentId: '3',
    messages: [
       { id: 'm4', senderId: 'me', text: 'Hi Lethabo, I loved your portfolio. I\'d like to book you for my wedding.', timestamp: '2d ago' },
       { id: 'm5', senderId: '3', text: 'Thank you so much! I\'d love to be part of your special day. When is it?', timestamp: '2d ago' },
    ],
    lastMessage: 'Thank you so much! I\'d love to be part of your special day. When is it?',
    lastMessageTimestamp: '2d ago',
    lastMessageDate: twoDaysAgo,
    unreadCount: 0,
  },
  {
    id: 'c3',
    talentId: '4',
    messages: [
        { id: 'm6', senderId: '4', text: 'Just confirming your booking for furniture removal this Saturday at 9 AM.', timestamp: '3d ago' },
        { id: 'm7', senderId: 'me', text: 'Confirmed! See you then.', timestamp: '3d ago' },
    ],
    lastMessage: 'Confirmed! See you then.',
    lastMessageTimestamp: '3d ago',
    lastMessageDate: threeDaysAgo,
    unreadCount: 0,
  },
    {
    id: 'c4',
    talentId: '2',
    messages: [
        { id: 'm8', senderId: 'me', text: 'Hi Thando, I need a photographer for a family portrait session.', timestamp: '4d ago' },
    ],
    lastMessage: 'Hi Thando, I need a photographer for a family portrait session.',
    lastMessageTimestamp: '4d ago',
    lastMessageDate: fourDaysAgo,
    unreadCount: 2,
  },
];

export const getTalentById = (id: string | undefined): Talent | undefined => TALENTS.find(t => t.id === id);
export const getTalentByPost = (post: Post): Talent | undefined => TALENTS.find(t => t.id === post.talentId);
export const getTalentByReel = (reel: Reel): Talent | undefined => TALENTS.find(t => t.id === reel.talentId);
export const getTalentByConversation = (conversation: Conversation): Talent | undefined => TALENTS.find(t => t.id === conversation.talentId);
export const getConversationById = (id: string | undefined): Conversation | undefined => CONVERSATIONS.find(c => c.id === id);
export const findOrCreateConversationByTalentId = (talentId: string): Conversation => {
    let conversation = CONVERSATIONS.find(c => c.talentId === talentId);
    if (!conversation) {
        const newConversation: Conversation = {
            id: `c${Date.now()}`,
            talentId: talentId,
            messages: [],
            lastMessage: 'Started a new conversation.',
            lastMessageTimestamp: 'Just now',
            lastMessageDate: new Date(),
            unreadCount: 0,
        };
        CONVERSATIONS.unshift(newConversation);
        conversation = newConversation;
    }
    return conversation;
};

export const getPostsByTalentId = (id: string | undefined): Post[] => {
    if (!id) return [];
    return POSTS.filter(p => p.talentId === id);
}
export const getReelsByTalentId = (id: string | undefined): Reel[] => {
    if (!id) return [];
    return REELS.filter(r => r.talentId === id);
}
export const markConversationAsRead = (conversationId: string | undefined): void => {
    if (!conversationId) return;
    const conversation = CONVERSATIONS.find(c => c.id === conversationId);
    if (conversation) {
        conversation.unreadCount = 0;
    }
};

export const addMessageToConversation = (conversationId: string, text: string): void => {
    const convoIndex = CONVERSATIONS.findIndex(c => c.id === conversationId);
    if (convoIndex === -1) return;

    const conversation = CONVERSATIONS[convoIndex];

    const newMessage: Message = {
        id: `m${Date.now()}`,
        senderId: 'me',
        text,
        timestamp: 'Just now',
    };

    conversation.messages.push(newMessage);
    conversation.lastMessage = text;
    conversation.lastMessageTimestamp = 'Just now';
    conversation.lastMessageDate = new Date();

    // Move to top
    CONVERSATIONS.splice(convoIndex, 1);
    CONVERSATIONS.unshift(conversation);
};

// --- User Authentication Mock Data ---
export let USERS: User[] = [
    { 
        id: 'client-test',
        email: 'client@book.me', 
        password: 'password123', 
        role: UserRole.Client, 
        name: 'Test Client',
        username: 'testclient',
        profileImage: 'https://picsum.photos/seed/client/200',
        bio: 'Just a client looking for amazing talent!',
        postsCount: 0,
        followersCount: 10,
        followingCount: 25,
        isPremium: false,
    },
    { 
        id: 'talent-sipho-moyo',
        email: 'talent@book.me', 
        password: 'Password123!', 
        role: UserRole.Talent, 
        name: 'Sipho Moyo',
        username: 'siphomoyo',
        profileImage: 'https://picsum.photos/seed/sipho/200',
        bio: "JHB's finest DJ with 10+ years of experience. I bring the vibe to any event, specializing in Amapiano, House, and Kwaito classics.",
        postsCount: 2,
        followersCount: 12500,
        followingCount: 150,
        talentId: '1',
        profession: 'DJ',
        verificationTier: 'gold',
        phoneNumber: '+27821234567',
        isPremium: true,
        subscriptionEndDate: getFutureDate(27), // Expires in 27 days
        settings: {
            activityDigestEnabled: true,
            primaryLocation: 'Sandton, JHB',
            jobSearchRadius: 50,
        },
    },
    { 
        id: 'client-sarah-p',
        email: 'sarah.p@email.com', password: 'password', role: UserRole.Client, name: 'Sarah P.', username: 'sarah_p',
        profileImage: 'https://picsum.photos/seed/sarahp/200', bio: 'Event enthusiast.', postsCount: 0, followersCount: 5, followingCount: 12,
        isPremium: false,
    },
    { 
        id: 'client-john-s',
        email: 'john.s@email.com', password: 'password', role: UserRole.Client, name: 'John S.', username: 'john_s',
        profileImage: 'https://picsum.photos/seed/johns/200', bio: 'Startup founder.', postsCount: 0, followersCount: 20, followingCount: 8,
        verificationTier: 'blue',
        phoneNumber: '+27837654321',
        isPremium: false,
    },
    { 
        id: 'client-jane-d',
        email: 'jane.d@email.com', password: 'password', role: UserRole.Client, name: 'Jane D.', username: 'jane_d',
        profileImage: 'https://picsum.photos/seed/janed/200', bio: 'Planning my dream wedding!', postsCount: 0, followersCount: 2, followingCount: 30,
        isPremium: false,
    },
    { 
        id: 'client-premium-records',
        email: 'ar@premium.com', password: 'password', role: UserRole.Client, name: 'Premium Records A&R', username: 'premiumrecords',
        profileImage: 'https://picsum.photos/seed/premiumrecords/200', bio: 'Finding the next big star.', postsCount: 0, followersCount: 500, followingCount: 10,
        verificationTier: 'gold',
        isPremium: false,
    },
     { 
        id: 'client-emily-t',
        email: 'emily.t@email.com', password: 'password', role: UserRole.Client, name: 'Emily T.', username: 'emily_t',
        profileImage: 'https://picsum.photos/seed/emilyt/200', bio: 'Mom of two, party planner.', postsCount: 0, followersCount: 8, followingCount: 15,
        isPremium: false,
    },
    { 
        id: 'client-mike-r',
        email: 'mike.r@email.com', password: 'password', role: UserRole.Client, name: 'Mike R.', username: 'mike_r',
        profileImage: 'https://picsum.photos/seed/miker/200', bio: '', postsCount: 0, followersCount: 1, followingCount: 3,
        isPremium: false,
    },
    { 
        id: 'client-corporate-events',
        email: 'events@corporate.com', password: 'password', role: UserRole.Client, name: 'Corporate Events Inc.', username: 'corporateevents',
        profileImage: 'https://picsum.photos/seed/corporateinc/200', bio: 'Professional event management.', postsCount: 0, followersCount: 150, followingCount: 80,
        verificationTier: 'gold',
        isPremium: true,
        subscriptionEndDate: getFutureDate(2), // Expires in 2 days to test notification
        settings: {
            activityDigestEnabled: false,
        },
    },
     ...Array.from({ length: 15 }, (_, i) => ({
        id: `client-new-${i}`,
        email: `newclient${i}@email.com`, 
        password: 'password', 
        role: UserRole.Client, 
        name: `New Client ${i+1}`,
        username: `newclient_${i+1}`,
        profileImage: `https://picsum.photos/seed/newclient${i}/200`, 
        bio: 'Looking for talent!', 
        postsCount: 0, 
        followersCount: (i % 5), 
        followingCount: (i % 10) + 1,
        verificationTier: i % 4 === 0 ? 'blue' as const : undefined,
        isPremium: false,
    }))
];

export const getClientById = (id: string): User | undefined => USERS.find(u => u.id === id && u.role === UserRole.Client);

export const findUserByEmail = (email: string): User | undefined => USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

export const addUser = (user: User): User | null => {
    if (findUserByEmail(user.email)) {
        return null; // User already exists
    }

    const baseId = `${user.role.toLowerCase()}-${user.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
    const profileImage = `https://picsum.photos/seed/${user.email}/200`;
    const username = user.name.replace(/\s+/g, '_').toLowerCase() + Math.floor(Math.random() * 100);

    const newUser: User = { 
        ...user, 
        id: baseId,
        username,
        profileImage,
        bio: '', 
        postsCount: 0, 
        followersCount: 0, 
        followingCount: 0, 
        profession: '',
        isPremium: false,
    };

    if (user.role === UserRole.Talent) {
        const newTalentId = `${Date.now()}`;
        const newTalent: Talent = {
            id: newTalentId,
            name: user.name,
            profileImage,
            rating: 0,
            reviewsCount: 0,
            distance: Math.floor(Math.random() * 30) + 1, // 1 to 30 km
            hustles: [],
            skills: [],
            bio: '',
            portfolio: [],
            reviews: [],
        };
        TALENTS.push(newTalent);
        newUser.talentId = newTalentId;
    }

    USERS.push(newUser);
    return newUser;
};

export const updateUserPassword = (email: string, newPassword: string): boolean => {
    const userIndex = USERS.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex !== -1) {
        USERS[userIndex].password = newPassword;
        return true;
    }
    return false;
};

export const addPost = (postData: { text: string; talentId: string; imageUrl?: string, music?: string }) => {
    const newPost: Post = {
        id: `p${Date.now()}`,
        talentId: postData.talentId,
        text: postData.text,
        imageUrl: postData.imageUrl,
        likes: 0,
        commentsCount: 0,
        timestamp: 'Just now',
        music: postData.music,
        comments: [],
    };
    POSTS.unshift(newPost);
};

export const addJob = (jobData: { title: string; clientId: string; location: string; budget: number; description: string; requiredProfession: string; }) => {
    const newJob: Job = {
        id: `j${Date.now()}`,
        ...jobData,
    };
    JOBS.unshift(newJob);
};

export const addCommentToPost = (postId: string, comment: Comment) => {
    const post = POSTS.find(p => p.id === postId);
    if (post) {
        post.comments.unshift(comment);
        post.commentsCount = post.comments.length;
    }
};

export const addCommentToReel = (reelId: string, comment: Comment) => {
    const reel = REELS.find(r => r.id === reelId);
    if (reel) {
        reel.comments.unshift(comment);
        reel.commentsCount = reel.comments.length;
    }
};

export const LOGIN_SESSIONS: LoginSession[] = [
    {
        id: '1',
        device: 'iPhone 16 Pro Max',
        location: 'Johannesburg, SA • This device',
        loginTime: 'Active now',
        isCurrent: true,
    },
    {
        id: '2',
        device: 'Windows PC',
        location: 'Pretoria, SA',
        loginTime: 'Active 2h ago',
        isCurrent: false,
    },
    {
        id: '3',
        device: 'Samsung SM-G998B',
        location: 'Durban, SA',
        loginTime: 'Active yesterday',
        isCurrent: false,
    },
];

export const TRANSACTIONS: Transaction[] = [
    {
        id: 't1',
        date: '2024-07-28',
        description: 'Booking Fee: Wedding DJ',
        amount: -3500.00,
        status: 'Completed',
        talentName: 'Sipho Moyo',
        talentProfileImage: 'https://picsum.photos/seed/sipho/200',
    },
    {
        id: 't2',
        date: '2024-07-25',
        description: 'Service Fee: Catering Deposit',
        amount: -1500.00,
        status: 'Completed',
        talentName: 'Ayanda Dlamini',
        talentProfileImage: 'https://picsum.photos/seed/ayanda/200',
    },
    {
        id: 't3',
        date: '2024-07-22',
        description: 'Payout: Gig "Sandton Wedding"',
        amount: 4800.00,
        status: 'Completed',
        talentName: 'Sipho Moyo',
        talentProfileImage: 'https://picsum.photos/seed/sipho/200',
    },
    {
        id: 't4',
        date: '2024-07-20',
        description: 'Booking Fee: Bridal Makeup',
        amount: -850.00,
        status: 'Pending',
        talentName: 'Lethabo Khumalo',
        talentProfileImage: 'https://picsum.photos/seed/lethabo/200',
    },
    {
        id: 't5',
        date: '2024-07-15',
        description: 'Payout: Gig "Corporate Event"',
        amount: 8500.00,
        status: 'Completed',
        talentName: 'Ayanda Dlamini',
        talentProfileImage: 'https://picsum.photos/seed/ayanda/200',
    },
    {
        id: 't6',
        date: '2024-07-10',
        description: 'Payout: Project "Brand Photoshoot"',
        amount: 6200.00,
        status: 'Completed',
        talentName: 'Thando Nkosi',
        talentProfileImage: 'https://picsum.photos/seed/thando/200',
    }
];

export const findUserByPhone = (phone: string): User | undefined => USERS.find(u => u.phoneNumber === phone);

export const findOrCreateUserByPhone = (phone: string, role: UserRole): User => {
    let user = findUserByPhone(phone);
    if (user) {
        // If user exists, just return them. Role check should happen in the component.
        return user;
    }
    
    // If user doesn't exist, create a new one.
    const newUser: User = {
        id: `${role.toLowerCase()}-phone-${Date.now()}`,
        email: `${phone}@book.me`, // Create a dummy email
        password: 'password123', // Dummy password
        role,
        name: `User ${phone.slice(-4)}`,
        username: `user_${phone.slice(-4)}`,
        phoneNumber: phone,
        profileImage: `https://picsum.photos/seed/${phone}/200`, 
        bio: '', 
        postsCount: 0, 
        followersCount: 0, 
        followingCount: 0,
        isPremium: false,
    };
    USERS.push(newUser);
    return newUser;
};

export const toggleCommentLike = (commentId: string) => {
    const allComments = [...POSTS.flatMap(p => p.comments), ...REELS.flatMap(r => r.comments)];
    const comment = allComments.find(c => c.id === commentId);

    if (comment) {
        if (comment.isLiked) {
            comment.likes -= 1;
            comment.isLiked = false;
        } else {
            comment.likes += 1;
            comment.isLiked = true;
        }
    }
};

export interface ActivityDigest {
  profileViews: { count: number; sampleViewerName: string };
  newComments: { count: number; sampleCommenterName: string; postText: string };
  newPosts: { samplePosterName: string };
  gigsLanded: { sampleTalentName: string };
}

export const generateActivityDigest = (): ActivityDigest => {
    const randomTalent1 = TALENTS[Math.floor(Math.random() * TALENTS.length)];
    const randomTalent2 = TALENTS[Math.floor(Math.random() * TALENTS.length)];
    const randomTalent3 = TALENTS[Math.floor(Math.random() * TALENTS.length)];
    const randomTalent4 = TALENTS[Math.floor(Math.random() * TALENTS.length)];
    
    return {
        profileViews: {
            count: Math.floor(Math.random() * 10) + 3,
            sampleViewerName: randomTalent1.name,
        },
        newComments: {
            count: Math.floor(Math.random() * 3) + 1,
            sampleCommenterName: randomTalent2.name,
            postText: "your latest post",
        },
        newPosts: {
            samplePosterName: randomTalent3.name,
        },
        gigsLanded: {
            sampleTalentName: randomTalent4.name,
        }
    };
};