export type CaseStudy = {
  id: string;
  client: string;
  person: string;
  quote: string;
  image: string;
  storyUrl: string;
};

// From the live "How Smart Growth Really Looks" block on growthnatives.com.
// Quotes and attributions are verbatim (including the live site's
// "afterlaunch"). Images are the live site's own, self-hosted in
// public/images/case-studies/. The live data has no case-study pages, only
// a video per client, so each card links to that video.
export const CASE_STUDIES_SECTION = {
  heading: "How Smart Growth Really Looks",
  subtitle:
    "Real clients. Real results. Real systems that keep delivering long after launch.",
  moreHref: "/work",
  moreLabel: "See more stories",
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "spirent",
    client: "Spirent",
    person: "Marketing Director",
    quote:
      "Real clients. Real results. Real systems that keep delivering long afterlaunch.",
    image: "/images/case-studies/spirent.webp",
    storyUrl: "https://www.youtube.com/watch?v=aYrhl6pSTpA",
  },
  {
    id: "lamav",
    client: "LAMAV",
    person: "CEO",
    quote: "Organic results powered by AI-first strategies.",
    image: "/images/case-studies/lamav.webp",
    storyUrl: "https://www.youtube.com/watch?v=_sLeCktGX9k",
  },
  {
    id: "escalon",
    client: "Escalon",
    person: "CFO",
    quote:
      "Powerful automation that boosts financial clarity and business scalability.",
    image: "/images/case-studies/escalon.webp",
    storyUrl: "https://www.youtube.com/watch?v=dU1HuqQ76rQ",
  },
];
