// From the live `cta_section` block on growthnatives.com. Heading and button
// label are verbatim. The live button points at /contact-us/; this rebuild's
// equivalent route is /talk-to-an-expert (the site-wide primary CTA).
export const FINAL_CTA = {
  heading: "Let's Build Your Next Growth Chapter",
  cta: { label: "Book Your Strategy Call", href: "/talk-to-an-expert" },
  // Placeholder panel art. Set `image` to a path under /public to swap the
  // gradient for a real photo — nothing else needs to change.
  image: null as string | null,
};
