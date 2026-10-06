export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  /** Opening sentence, set in full white. */
  highlight: string;
  /** The rest of the quote, set muted. `highlight + " " + rest` is the
   *  testimonial exactly as it appears on the live site. */
  rest: string;
  image: string;
};

// From the live "Real Stories. Real Growth." block on growthnatives.com
// (CMS `reviews_section`). Copy is verbatim — do not rewrite or trim it.
// Four of the eleven live testimonials are shown: ones whose quotes are
// complete on the live site (two there are cut off mid-sentence) and whose
// portraits are large enough to fill half the panel.
export const TESTIMONIALS_SECTION = {
  heading: "Real Stories. Real Growth.",
  subtitle:
    "What it's like to work with a team that actually builds with you.",
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "larissa-varela",
    name: "Larissa Varela",
    role: "Global Head of Growth Marketing",
    company: "Piya",
    highlight:
      "Growth Natives has played a big role in helping us get the most out of HubSpot.",
    rest: "They set up our lead scoring, workflows, campaigns, and other key features in a way that actually makes our day-to-day easier. Their support is fast, reliable, and always practical. This partnership has helped us use HubSpot more effectively and improve our overall operations. Growth Natives has truly been a key part of optimizing how we work.",
    image: "/images/testimonials/larissa-varela.webp",
  },
  {
    id: "mike-liebson",
    name: "Mike Liebson",
    role: "VP Marketing",
    company: "New Horizon",
    highlight:
      "As a start-up, we didn’t have the in-house expertise to scale our digital transformation and marketing initiatives quickly.",
    rest: "Growth Natives gave us instant access to a seasoned team with experience in HubSpot implementation, SEO, and LinkedIn advertising. They helped us get our demand gen efforts off the ground fast and in the right direction.",
    image: "/images/testimonials/mike-liebson.webp",
  },
  {
    id: "alexia-smith",
    name: "Alexia Smith",
    role: "VP Marketing",
    company: "Dispatch",
    highlight:
      "Working with Growth Natives on our new website was a great experience for our team at Dispatch.",
    rest: "Their communication was excellent, keeping us informed, involved, and confident throughout the entire process. They stayed on schedule, hit their deadlines, and never compromised on quality.",
    image: "/images/testimonials/alexia-smith.webp",
  },
  {
    id: "mike-mayhew",
    name: "Mike Mayhew",
    role: "CTO",
    company: "Lightspeed",
    highlight:
      "Growth Natives helped us unlock the full potential of our HubSpot Suite.",
    rest: "We now deliver a smoother, more personalized client experience while keeping data security front and center. Their team really understood our goals and turned them into measurable outcomes using HubSpot. We look forward to continuing this awesome partnership.",
    image: "/images/testimonials/mike-mayhew.webp",
  },
];
