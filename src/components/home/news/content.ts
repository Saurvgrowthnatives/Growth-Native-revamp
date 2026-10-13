export type NewsItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  href: string;
};

// From the live "In the News & On the Move" block on growthnatives.com.
// Heading, body, titles, categories, dates and read times are verbatim —
// do not rewrite them. Images are the live site's own press graphics,
// self-hosted in public/images/news/.
export const NEWS_SECTION = {
  eyebrow: "Newsroom",
  heading: "In the News & On the Move",
  body: "Recognition, partnerships, and proof that we're moving the needle.",
  readMoreText: "Read more",
};

// The live site links each item to /blogs/<slug>/.
const url = (slug: string) => `https://growthnatives.com/blogs/${slug}/`;

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "iso-certification",
    title:
      "Growth Natives Earns ISO/IEC 42001 Certification and ISO/IEC 23894 Compliance, Strengthening Responsible AI Delivery",
    category: "Press Release",
    date: "September 8, 2026",
    readTime: "2 min read",
    image: "/images/news/iso-certification.png",
    href: url(
      "growth-natives-earns-iso-iec-42001-certification-and-iso-iec-23894-compliance-strengthening-responsible-ai-delivery",
    ),
  },
  {
    id: "inc-5000",
    title:
      "Growth Natives Ranks No. 2432 on the 2026 Inc. 5000 List, Marking Its Third Consecutive Year Among America's Fastest-Growing Private Companies",
    category: "Press Release",
    date: "August 18, 2026",
    readTime: "3 min read",
    image: "/images/news/inc-5000.png",
    href: url(
      "growth-natives-ranks-no-2432-on-the-2026-inc-5000-list-marking-its-third-consecutive-year-among-americas-fastest-growing-private-companies",
    ),
  },
  {
    id: "ai-center-of-excellence",
    title:
      "Growth Natives Launches AI Center of Excellence to Power the Next Era of Intelligent Growth",
    category: "Press Release",
    date: "March 6, 2026",
    readTime: "2 min read",
    image: "/images/news/ai-center-of-excellence.webp",
    href: url(
      "growth-natives-launches-ai-center-of-excellence-to-power-the-next-era-of-intelligent-growth",
    ),
  },
];
