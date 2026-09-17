import { METRICS, WHY_PARTNER } from "./content";

/**
 * Non-WebGL presentation of the same architecture. Used on small screens, when
 * reduced motion is requested, and when WebGL is unavailable — so the section is
 * never an empty canvas and never hides content.
 */
export function WhyPartnerStatic() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 py-20 sm:py-24 lg:py-28">
      <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-gn-blue">
        <span className="h-px w-8 bg-gn-blue/40" aria-hidden />
        {WHY_PARTNER.eyebrow.toUpperCase()}
      </p>

      <h2 className="mt-6 max-w-[620px] text-[30px] font-semibold leading-[1.15] tracking-tight text-gn-black sm:text-[38px]">
        {WHY_PARTNER.heading}
      </h2>

      <p className="mt-5 max-w-[540px] text-base leading-7 text-gn-dark-grey">
        {WHY_PARTNER.description}
      </p>

      {/* Structural stack — thin technical framing, one layer per metric */}
      <div className="relative mt-12 sm:mt-16">
        <div
          className="absolute left-4 top-0 hidden h-full w-px bg-gn-black/10 sm:block"
          aria-hidden
        />
        <ul className="flex flex-col gap-3">
          {METRICS.map((metric, i) => (
            <li
              key={metric.id}
              className="relative border border-gn-black/[0.14] bg-white/70 px-5 py-6 sm:px-8 sm:py-7"
              style={{ borderRadius: 3 }}
            >
              <span
                className="absolute left-0 top-0 h-2 w-2 border-l border-t border-gn-black/25"
                aria-hidden
              />
              <span
                className="absolute right-0 top-0 h-2 w-2 border-r border-t border-gn-black/25"
                aria-hidden
              />
              <span
                className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-gn-black/25"
                aria-hidden
              />
              <span
                className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-gn-black/25"
                aria-hidden
              />

              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="text-[34px] font-medium leading-none tracking-tight text-gn-black sm:w-[120px] sm:shrink-0">
                  {metric.value}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-gn-black sm:text-[15px]">
                    {metric.label}
                  </span>
                  <span className="text-sm leading-6 text-gn-dark-grey">
                    {metric.description}
                  </span>
                </span>
              </div>

              <span
                className="absolute right-5 top-1/2 hidden h-px w-6 -translate-y-1/2 sm:block"
                style={{
                  background:
                    i === METRICS.length - 1
                      ? "var(--gradient-gn-primary)"
                      : "rgba(3,8,15,0.18)",
                }}
                aria-hidden
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
