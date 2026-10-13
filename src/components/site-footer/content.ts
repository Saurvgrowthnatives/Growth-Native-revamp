export type FooterLink = { label: string; href: string; external?: boolean };

// From the live footer on growthnatives.com. Labels, URLs and contact
// details are verbatim. Internal URLs are kept exactly as they are live
// (root-relative, trailing slash) so they resolve when this rebuild replaces
// the current site, per the PRD's "retain important existing URLs".

export const CONTACT = [
  { label: "Address", value: "2009 Killarney Way, Bellevue WA 98004" },
  {
    label: "Sales",
    value: "sales@growthnatives.com",
    href: "mailto:sales@growthnatives.com",
  },
  {
    label: "Phone no.",
    value: "+1 (425) 389-6118",
    href: "tel:+1(425)389-6118",
  },
  {
    label: "Careers",
    value: "hr@growthnatives.com",
    href: "mailto:hr@growthnatives.com",
  },
] as const;

export const LINK_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Marketing Automation", href: "/marketing-automation-services/" },
      { label: "Salesforce", href: "/salesforce-services/" },
      { label: "Analytics as a Service", href: "/marketing-analytics-services/" },
      { label: "Digital Marketing", href: "/digital-marketing-services/" },
      { label: "Development Services", href: "/development-services/" },
      { label: "Design Services", href: "/ui-ux-design-agency/" },
      { label: "Strategic Services", href: "/strategic-services/" },
      { label: "Jira Professional Services", href: "/jira-professional-services/" },
      { label: "Content Marketing Services", href: "/content-marketing-services/" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Blog", href: "/blogs/" },
      { label: "Case Studies", href: "/case-studies/" },
      { label: "Infographics", href: "/infographics/" },
      { label: "Downloadable Assets", href: "/downloadable-assets/" },
      { label: "E-Books", href: "/ebooks/" },
      { label: "Growth Stream", href: "/growth-stream/" },
      { label: "Press Releases", href: "/press-release/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about/" },
      { label: "Meet the Team", href: "/meet-the-team/" },
      { label: "Careers", href: "/careers/" },
      { label: "Contact Us", href: "/contact-us/" },
      { label: "FAQs", href: "/faqs/" },
    ],
  },
];

export const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/growthnatives/" },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/growthnatives/mycompany/verification/",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/channel/UC1Zg8vMT43lQ9KdeLmy-U_w",
  },
  { id: "twitter", label: "Twitter", href: "https://twitter.com/GrowthNatives" },
] as const;

export const FOLLOW = {
  tag: "#growingtogether",
  heading: "Follow Us",
};

// Alt text is read off each badge itself (the live site's alts are just
// "ISO" and a misspelt "Artifical intelligence Management ISO").
export const CERTIFICATIONS = {
  title: "Certified & Compliant",
  subtitle: "Standards we're audited against",
  badges: [
    { src: "/images/footer/iso-27701.webp", alt: "ISO/IEC 27701:2019 certified" },
    { src: "/images/footer/iso-27001.webp", alt: "ISO/IEC 27001:2013 certified" },
    { src: "/images/footer/gdpr.webp", alt: "GDPR compliant" },
    { src: "/images/footer/hipaa.webp", alt: "HIPAA compliant" },
    { src: "/images/footer/iso-42001.webp", alt: "ISO/IEC 42001 certified" },
    { src: "/images/footer/iso-23894.webp", alt: "ISO/IEC 23894 compliant" },
  ],
} as const;

export const LEGAL_LINKS: FooterLink[] = [
  { label: "Terms & Conditions", href: "/terms-conditions/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Cookie Policy", href: "/cookie-policy/" },
  { label: "Editorial Policy", href: "/editorial-policy/" },
  {
    label: "AI Policy",
    href: "https://api.growthnatives.com/wp-content/uploads/2026/07/GN-AIMS-F06_AI_Policy.pdf",
    external: true,
  },
];

export const DMCA = {
  href: "https://www.dmca.com/Protection/Status.aspx?id=639f9bc7-120f-4893-ae6b-66cc4a2e041d&refurl=https%3a%2f%2fgrowthnatives.com%2f&rlo=true",
  src: "/images/footer/dmca.webp",
  width: 120,
  height: 24,
};

export const COPYRIGHT = "All Rights Reserved";
