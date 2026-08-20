export interface ProjectShowcase {
  id: string;
  title: string;
  category: 'Web Design' | 'Video Editing' | 'Growth Agency' | 'Resume & CV';
  categoryLabel: string;
  description: string;
  outcomeMetric: string;
  outcomeLabel: string;
  image: string;
  tags: string[];
  client: string;
  featured?: boolean;
}

export interface DivisionItem {
  id: string;
  divisionNumber: number;
  title: string;
  subtitle: string;
  description: string;
  executionMatrix: string;
  affordableEstimate: string;
  startingPrice: string;
  deliverables: string[];
  accentColor: string;
  badge: string;
  iconName: string;
  image: string;
  sampleName: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const AGENCY_INFO = {
  name: "Walt Designs & Studio",
  tagline: "We engineer premium, professional digital products designed with zero lag.",
  founder: "Priyanshu Kumar",
  founderRole: "Founder & Creative Director",
  founderQuote: "We set out to challenge the average agency narrative in India. No slow templates, no generic templates, and no hidden billing brackets. Every Walt project gets my direct focus and execution signature.",
  phone: "+91 8276825128",
  phoneRaw: "+918276825128",
  email: "waltdesignsstudio@gmail.com",
  formspreeEndpoint: "https://formspree.io/f/xreylalq",
  headOffice: "West Bengal, India",
  ncrHubs: "Delhi, Noida, Faridabad",
  logoUrl: "https://i.ibb.co/gZjvhbtL/Whats-App-Image-2026-08-20-at-11-46-18.jpg",
  stats: {
    customers: "120+",
    customersLabel: "Delighted Customers",
    rating: "4.3",
    ratingLabel: "Avg Rating",
    support: "24/7",
    supportLabel: "Backend Team",
    successRate: "98%",
    successRateLabel: "Project Success Rate",
    completedProjects: "80+",
    onTimeRate: "100%"
  }
};

export const CORE_PILLARS = [
  {
    title: "On-time Service",
    subtitle: "On-time Service",
    description: "Strictest compliance to agreed milestone timelines. We respect commitments with zero drag.",
    icon: "Clock"
  },
  {
    title: "Affordable Prices",
    subtitle: "Affordable Prices",
    description: "World-class premium designs engineered transparently without deep cost barriers.",
    icon: "BadgeIndianRupee"
  },
  {
    title: "Available all over India",
    subtitle: "Available all over India",
    description: "Client nodes established key zones—including NCR and West Bengal headquarters.",
    icon: "MapPin"
  },
  {
    title: "High quality Service in budget",
    subtitle: "High quality Service in budget",
    description: "Exquisite elite-tier engineering and creative outcomes tailored to clear pricing targets.",
    icon: "ShieldCheck"
  }
];

export const SHOWCASE_PROJECTS: ProjectShowcase[] = [
  {
    id: "svelte-ecommerce",
    title: "Svelte Ecommerce Architecture",
    category: "Web Design",
    categoryLabel: "Web Design",
    description: "Next-gen React and Tailwind commerce suite featuring micro-interactions and smooth payment flows.",
    outcomeMetric: "60% Faster Loading",
    outcomeLabel: "Demonstrated Outcome",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    tags: ["React 19", "Tailwind CSS", "Vite", "Razorpay / Stripe", "Sub-100ms LCP"],
    client: "Nexus Brands Direct",
    featured: true
  },
  {
    id: "alpha-shorts",
    title: "Alpha Shorts YouTube Growth",
    category: "Video Editing",
    categoryLabel: "Video Editing",
    description: "Dynamic short-form video edit pack combining high visual contrast subtitles and custom audio grading.",
    outcomeMetric: "14M+ Aggregate Views",
    outcomeLabel: "Demonstrated Outcome",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    tags: ["Premiere Pro", "After Effects", "Sound Design", "4K Color Grade", "Kinetic Subtitles"],
    client: "Alpha Media Network",
    featured: true
  },
  {
    id: "gmb-dominance",
    title: "Google My Business Dominance",
    category: "Growth Agency",
    categoryLabel: "Growth Agency",
    description: "Comprehensive SEO listing and schema optimization scaling 4 local franchises onto Delhi primary packs.",
    outcomeMetric: "Top 3 Map Ranking",
    outcomeLabel: "Demonstrated Outcome",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Google Maps SEO", "Schema Markup", "Local Citations", "Review Automation", "NCR Dominance"],
    client: "NCR Multi-Chain Clinics",
    featured: true
  },
  {
    id: "executive-resume",
    title: "Executive Portfolio Resume",
    category: "Resume & CV",
    categoryLabel: "Resume & CV",
    description: "Bespoke, ATS-friendly digital CV design featuring interactive achievements logs and elegant layouts.",
    outcomeMetric: "Interviews Secured",
    outcomeLabel: "Demonstrated Outcome",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80",
    tags: ["ATS 98% Score", "Harvard Standard", "Bio Page Web Link", "Quantified Achievements"],
    client: "VP of Product, FinTech",
    featured: true
  },
  {
    id: "fintech-portal",
    title: "Stellar Cloud Enterprise SaaS",
    category: "Web Design",
    categoryLabel: "Web Design",
    description: "Multi-tenant cloud management portal with real-time telemetry graphs, dark-mode styling, and zero render drag.",
    outcomeMetric: "4.9/5 User Score",
    outcomeLabel: "Demonstrated Outcome",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tags: ["TypeScript", "NextJS", "Real-time Charting", "Zero-Lag UI"],
    client: "Aura Logic Labs"
  },
  {
    id: "youtube-thumbnail-suite",
    title: "Viral Creator Thumbnail Suite",
    category: "Video Editing",
    categoryLabel: "Video Editing",
    description: "High CTR psychological thumbnail suite engineered with facial contrast enhancement and high-retention cues.",
    outcomeMetric: "11.8% CTR Average",
    outcomeLabel: "Demonstrated Outcome",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    tags: ["Photoshop CC", "A/B CTR Testing", "Color Grading", "High-Contrast Visuals"],
    client: "Creator Academy India"
  }
];

export const DIVISIONS: DivisionItem[] = [
  {
    id: "div-1",
    divisionNumber: 1,
    title: "Web Designing/Developing",
    subtitle: "High-Converting, Lightning-Fast Digital Experiences",
    description: "We craft high-converting, lightning-fast digital experiences tailored strictly to your business objectives. From sleek corporate dashboards to fluid eCommerce portals, we write flawless code ensuring zero lag and maximum conversions. All sites include fully integrated backend systems and custom SEO foundation.",
    executionMatrix: "7-14 Days",
    affordableEstimate: "Starting at ₹15,000",
    startingPrice: "₹15,000",
    badge: "Flagship Division",
    accentColor: "from-cyan-500/20 to-blue-500/20",
    iconName: "Code2",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80",
    sampleName: "Sample: React & Tailwind Custom Web Platform",
    deliverables: [
      "React & NextJS / Vite Tech Stack",
      "Mobile-Responsive & Speed Optimized",
      "Bespoke UI/UX Layouts",
      "Integrated Content Management Systems",
      "SEO & Analytics Groundwork"
    ]
  },
  {
    id: "div-2",
    divisionNumber: 2,
    title: "Resume & CV Making",
    subtitle: "ATS-Optimized Executive & Professional Profiles",
    description: "Elevate your professional profile with resume structures engineered specifically to bypass automated applicant tracking systems (ATS). We match content to target job descriptions, building powerful descriptions, sleek layouts, and matching digital bio websites that capture executive attention.",
    executionMatrix: "2-4 Days",
    affordableEstimate: "Starting at ₹1,500",
    startingPrice: "₹1,500",
    badge: "Fast Turnaround",
    accentColor: "from-amber-500/20 to-orange-500/20",
    iconName: "FileText",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
    sampleName: "Sample: ATS-Approved Executive Curriculum Vitae",
    deliverables: [
      "ATS-Friendliness Score >95%",
      "Custom Executive Layouts",
      "Industry-Specific Keyword Mapping",
      "Digital Bio Pages (Web version)",
      "Standard Formats (PDF/Word)"
    ]
  },
  {
    id: "div-3",
    divisionNumber: 3,
    title: "Thumbnail & Video Editing",
    subtitle: "High-CTR Visuals & Cinematic Video Production",
    description: "Turn viewers into loyal subscribers. We design thumbnails with high visual contrast that draw high click-through rates. Our video editing suite handles reels, shorts, or long-form features with flawless audio correction, rhythmic cuts, dynamic captions, and expert color styling.",
    executionMatrix: "3-5 Days",
    affordableEstimate: "Starting at ₹2,500",
    startingPrice: "₹2,500",
    badge: "High Engagement",
    accentColor: "from-purple-500/20 to-pink-500/20",
    iconName: "Video",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    sampleName: "Sample: 4K Video Edit & High-Contrast Thumbnail",
    deliverables: [
      "High Click-Through & Impression CTRs",
      "Cinematic Color Grading & SFX",
      "Rhythmic Subtitles & Captions",
      "Engaging Call-to-Actions (CTAs)",
      "Multi-Format Export (HD/4K)"
    ]
  },
  {
    id: "div-4",
    divisionNumber: 4,
    title: "Growth Agency & Business Establishment",
    subtitle: "Google Maps Domination & Influencer Partnerships",
    description: "We configure and secure your digital presence on Google Maps & Search. We also partner you with vetted influencers across India to drive qualified prospects straight into your sales channels, establishing local authority fast.",
    executionMatrix: "Ongoing / Monthly plans",
    affordableEstimate: "Starting at ₹12,000",
    startingPrice: "₹12,000",
    badge: "Scale & Authority",
    accentColor: "from-emerald-500/20 to-teal-500/20",
    iconName: "TrendingUp",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    sampleName: "Sample: Google My Business Top 3 Maps Rank & Outreach",
    deliverables: [
      "Google My Business setup & SEO ranking",
      "Local Map Citation & Review management",
      "Vetted Influencer Collaborations",
      "Social Media Expansion Funnels",
      "Growth Analytics Auditing"
    ]
  },
  {
    id: "div-5",
    divisionNumber: 5,
    title: "Licence & Forms Registration",
    subtitle: "Frictionless Legal Paperwork & MSME Compliance",
    description: "Bypass government bureaucracy with secure, guided registration frameworks. We handle all paperwork filings, MSME digital setups, local trade certifications, and digital business form requests on your behalf with complete security and updates.",
    executionMatrix: "5-10 Days",
    affordableEstimate: "Starting at ₹3,500",
    startingPrice: "₹3,500",
    badge: "Bureaucracy Bypass",
    accentColor: "from-indigo-500/20 to-violet-500/20",
    iconName: "Stamp",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    sampleName: "Sample: Official MSME & Commercial Licencing Documents",
    deliverables: [
      "MSME & GST Application filing",
      "Local Municipal Trade Licences",
      "Business Form Setup assistance",
      "Expert Documentation Auditing",
      "Secure status tracking log"
    ]
  }
];

export const FAQS: FAQItem[] = [
  {
    category: "General & Process",
    question: "How does Walt Designs & Studio guarantee zero lag in web development?",
    answer: "We avoid heavy page builders and bloated WordPress plugins. Every website is built from clean source code utilizing lightweight React, Vite, Tailwind CSS, or clean semantic architectures. This ensures sub-second initial loads, optimal core web vitals, and 95+ Google PageSpeed scores."
  },
  {
    category: "Pricing & Payments",
    question: "Are your prices truly transparent with no hidden charges?",
    answer: "Yes, 100%. Every quotation comes with a fixed Execution Matrix, explicit deliverable breakdown, and zero unexpected line items. What we agree upon in the contract is what you pay."
  },
  {
    category: "Geographic Coverage",
    question: "Do you serve clients outside of West Bengal and the National Capital Region (NCR)?",
    answer: "Absolutely. While our operational headquarters is in West Bengal and we maintain active client clusters in Delhi, Noida, and Faridabad, 100% of our workflow is remote-optimized to serve clients across all Indian states and global founders."
  },
  {
    category: "Resume & Career",
    question: "What makes your ATS-Friendly Resumes different from online templates?",
    answer: "Online generator templates frequently use complex tables or multi-column spans that choke ATS parsers. We use verified linear single/double hierarchy parsing, industry-tailored keywords, and quantitative metric highlights that pass enterprise ATS scanners with scores above 95%."
  },
  {
    category: "Video & Media",
    question: "What is your turnaround time for YouTube Shorts, Reels, and Thumbnails?",
    answer: "Our typical execution matrix for thumbnail packs and short-form video edits is 3 to 5 business days, with rush turnaround (24-48 hours) available upon request for breaking content cycles."
  },
  {
    category: "Support & Timeline",
    question: "What is your response time for new inquiries?",
    answer: "We guarantee a first personalized technical response in under 12 hours. For urgent project kickoffs, you can also dial our direct Executive Hotline at +91 8276825128."
  }
];
