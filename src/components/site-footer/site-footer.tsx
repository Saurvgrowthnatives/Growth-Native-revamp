import Image from "next/image";
import Link from "next/link";
import { BackToTop } from "./back-to-top";
import {
  CERTIFICATIONS,
  CONTACT,
  COPYRIGHT,
  DMCA,
  FOLLOW,
  LEGAL_LINKS,
  LINK_COLUMNS,
  SOCIALS,
} from "./content";

/** 24px stroke icons (Feather, MIT) — lucide ships no brand marks. */
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  youtube: (
    <>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </>
  ),
  twitter: (
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  ),
};

const linkClass =
  "text-[14px] leading-snug text-white/60 transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gn-blue";

/**
 * Papermark-style footer (papermark.com) carrying Growth Natives' own footer
 * content: a brand column, link columns, a social column, a certifications
 * row, and a legal bar — on GN Black with hairline dividers.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gn-black text-white">
      <div className="mx-auto max-w-[1320px] px-6">
        {/* ── main grid ── */}
        <div className="grid gap-x-8 gap-y-12 pt-16 pb-14 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr] lg:pt-20">
          {/* brand + contact */}
          <div>
            <Link
              href="/"
              aria-label="Growth Natives home"
              className="inline-flex focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gn-blue"
            >
              <Image
                src="/brand/growth-natives-logo.svg"
                alt="Growth Natives"
                width={254}
                height={70}
                className="h-8 w-auto"
              />
            </Link>
            <dl className="mt-8 space-y-5">
              {CONTACT.map((item) => (
                <div key={item.label}>
                  <dt className="text-[14px] font-medium text-white">{item.label}</dt>
                  <dd className="mt-1">
                    {"href" in item ? (
                      <a href={item.href} className={`${linkClass} break-all`}>
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-[14px] leading-snug text-white/60">
                        {item.value}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* link columns */}
          {LINK_COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[14px] font-medium tracking-[-0.01em] text-white">
                {col.title}
              </p>
              <ul className="mt-5 space-y-[13px]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={linkClass}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* follow */}
          <div>
            <p className="bg-[linear-gradient(90deg,#0074F8,#19C027)] bg-clip-text text-[16px] font-semibold text-transparent">
              {FOLLOW.tag}
            </p>
            <p className="mt-3 text-[14px] font-medium tracking-[-0.01em] text-white">
              {FOLLOW.heading}
            </p>
            <ul className="mt-5 flex flex-wrap gap-3">
              {SOCIALS.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/85 transition-colors duration-200 hover:border-white/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gn-blue"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {SOCIAL_ICONS[social.id]}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── certifications ── */}
        <div className="flex flex-col gap-6 border-t border-white/10 py-8 lg:flex-row lg:items-center lg:gap-12">
          <div className="shrink-0 lg:w-56">
            <p className="bg-[linear-gradient(90deg,#0074F8,#19C027)] bg-clip-text text-[16px] font-semibold text-transparent">
              {CERTIFICATIONS.title}
            </p>
            <p className="mt-1 text-[12px] text-white/45">{CERTIFICATIONS.subtitle}</p>
          </div>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-5">
            {CERTIFICATIONS.badges.map((badge) => (
              <li key={badge.src}>
                <Image
                  src={badge.src}
                  alt={badge.alt}
                  width={160}
                  height={160}
                  className="h-14 w-14 object-contain opacity-80 transition-opacity duration-200 hover:opacity-100"
                />
              </li>
            ))}
          </ul>
        </div>

        {/* ── legal bar ── */}
        <div className="flex flex-col gap-5 border-t border-white/10 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[12px] text-white/50 transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gn-blue"
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-[12px] text-white/50">
              Copyright © {year} {COPYRIGHT}
            </p>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={DMCA.href}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gn-blue"
            >
              <Image
                src={DMCA.src}
                alt="DMCA protected"
                width={DMCA.width}
                height={DMCA.height}
                className="h-6 w-auto"
              />
            </a>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
