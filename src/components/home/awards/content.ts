export type Award = {
  id: string;
  name: string;
  logo: string;
};

// From the live "Awards and Recognitions" block on growthnatives.com
// (CMS `awards_section_component`).
export const AWARDS_SECTION = {
  eyebrow: "Awards",
  heading: "Awards and Recognitions",
  description:
    "We are honored and humbled to have received multiple awards and accolades in our growing years.",
};

// The live site shows only the six logos, in this order, with no names or
// detail links. `name` is read off each logo itself (no ratings or claims) so
// every item has a visible label; replace with the official award titles if
// they differ. Logos are self-hosted in public/awards/.
export const AWARDS: Award[] = [
  { id: "inc-5000", name: "Inc. 5000", logo: "/awards/inc.png" },
  {
    id: "hubspot-impact",
    name: "HubSpot Impact Awards",
    logo: "/awards/hubspot.webp",
  },
  { id: "clutch", name: "Clutch", logo: "/awards/clutch.webp" },
  {
    id: "salesforce-appexchange",
    name: "Salesforce AppExchange",
    logo: "/awards/salesforce.webp",
  },
  { id: "comparably", name: "Comparably", logo: "/awards/comparably.webp" },
  { id: "glassdoor", name: "Glassdoor", logo: "/awards/glassdoor.webp" },
];
