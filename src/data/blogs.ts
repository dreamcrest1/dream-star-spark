export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

export const blogs: Blog[] = [
  {
    id: 1,
    title: "What is Netflix Travel Update Code?",
    slug: "netflix-travel-update-code",
    excerpt: "Learn how to watch Netflix while traveling and what you need to know about Netflix's travel update feature.",
    content: `Netflix has implemented household verification to prevent password sharing. When you travel, you may need to verify your device with a travel code.

**How it works:**
1. When traveling, Netflix may ask you to verify your device
2. You'll receive a code on your primary device or registered email
3. Enter this code to continue watching on your travel device

**Our Solution:**
At Dreamstar Solution, we offer Netflix code solutions that help you manage these travel codes instantly through our proprietary platform at code.dreamstarsolution.com.`,
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80",
    category: "Streaming",
    author: "Dreamstar Team",
    date: "2026-01-05",
    readTime: "3 min"
  },
  {
    id: 2,
    title: "Movie Box Pro: The Ultimate Streaming Solution",
    slug: "movie-box-pro-guide",
    excerpt: "Discover why Movie Box Pro is the all-in-one streaming solution that brings all your favorite content in one place.",
    content: `Movie Box Pro is revolutionizing how we consume streaming content. It combines content from multiple platforms into a single, seamless experience.

**Features:**
- Access content from Netflix, Prime Video, Hulu, and more
- High-quality streaming up to 4K
- Works on multiple devices
- No ads interrupting your viewing

**Why Choose Movie Box Pro?**
Instead of juggling multiple subscriptions, Movie Box Pro offers a unified interface at a fraction of the cost.`,
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80",
    category: "Apps",
    author: "Dreamstar Team",
    date: "2026-01-03",
    readTime: "4 min"
  },
  {
    id: 3,
    title: "Understanding OTT Services: A Complete Guide",
    slug: "ott-services-guide",
    excerpt: "Everything you need to know about OTT services and how to get the best deals on premium subscriptions.",
    content: `Over-the-Top (OTT) services have transformed entertainment consumption. Here's what you need to know.

**What is OTT?**
OTT refers to content providers that deliver streaming media over the internet, bypassing traditional cable or satellite providers.

**Popular OTT Platforms:**
- Netflix
- Amazon Prime Video
- Disney+ Hotstar
- Spotify
- YouTube Premium

**How Dreamstar Helps:**
We provide premium OTT subscriptions at up to 80% off the original price, making entertainment accessible to everyone.`,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
    category: "Guides",
    author: "Dreamstar Team",
    date: "2025-12-28",
    readTime: "5 min"
  },
  {
    id: 4,
    title: "Group Buy Tools: What Are They?",
    slug: "group-buy-tools-explained",
    excerpt: "Learn about group buy tools and how DreamTools panel gives you access to premium SEO and marketing tools.",
    content: `Group buy tools allow multiple users to share the cost of expensive software subscriptions, making premium tools accessible.

**What is DreamTools?**
DreamTools.in is our modern panel built with React.js, offering seamless access to premium tools including:
- SEO Tools (Ahrefs, SEMrush, Moz)
- Design Tools (Canva Pro, Adobe Suite)
- Development Tools
- Marketing Automation

**Benefits:**
- Save up to 90% on premium tools
- Access multiple tools with one subscription
- Regular updates and new tool additions`,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    category: "Tools",
    author: "Dreamstar Team",
    date: "2025-12-20",
    readTime: "4 min"
  },
  {
    id: 5,
    title: "Why Dreamstar is India's Most Trusted OTT Provider",
    slug: "why-choose-dreamstar",
    excerpt: "Discover what makes Dreamstar Solution the preferred choice for 15,000+ customers across India.",
    content: `Since 2021, Dreamstar Solution has grown to become India's most trusted multi-platform service provider.

**Our Journey:**
- Founded in 2021
- 15,000+ satisfied customers
- 200+ products and services
- International expansion

**What Sets Us Apart:**
1. **Affordable Pricing**: Up to 80% off on premium services
2. **Instant Delivery**: Most orders delivered within minutes
3. **1 Year Warranty**: All lifetime services come with warranty
4. **24/7 Support**: Always available to help

**Our Brands:**
- Dreamstar Solution (OTT Services)
- Dreamcrest Solutions (Cloud Services)
- DreamTools.in (Group Buy Tools)`,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    category: "Company",
    author: "Dreamstar Team",
    date: "2025-12-15",
    readTime: "3 min"
  }
];
