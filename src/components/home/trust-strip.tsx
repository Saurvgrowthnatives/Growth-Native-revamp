import Image from "next/image";

const LOGOS = [
  { file: "adobe", name: "Adobe" },
  { file: "booking-com", name: "Booking.com" },
  { file: "highspot", name: "Highspot" },
  { file: "xactly", name: "Xactly" },
  { file: "lightspeed", name: "Lightspeed" },
  { file: "godrej", name: "Godrej" },
  { file: "escalon", name: "Escalon" },
  { file: "funnelenvy", name: "FunnelEnvy" },
  { file: "gandergroup", name: "Gander Group" },
  { file: "imageware", name: "Imageware" },
  { file: "lamav", name: "Lamav" },
  { file: "nue", name: "Nue" },
  { file: "takefive", name: "TakeFive" },
  { file: "you-by-sia", name: "You by SIA" },
  { file: "dispatch", name: "Dispatch" },
  { file: "autumn", name: "Autumn" },
];

function LogoRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-14 pr-14"
      aria-hidden={ariaHidden}
    >
      {LOGOS.map((logo) => (
        <div
          key={logo.file}
          className="flex h-8 w-[130px] shrink-0 items-center justify-center grayscale opacity-50 transition-all duration-300 ease-out hover:grayscale-0 hover:opacity-100"
        >
          <Image
            src={`/logos/${logo.file}.png`}
            alt={logo.name}
            width={130}
            height={32}
            className="h-auto max-h-8 w-auto max-w-[130px] object-contain"
          />
        </div>
      ))}
    </div>
  );
}

export function TrustStrip() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-6">
        <p className="mb-10 text-center text-sm font-medium text-gn-dark-grey">
          Trusted to power growth
        </p>
      </div>

      <div className="gn-marquee-group gn-marquee-fade relative overflow-hidden">
        <div className="gn-marquee-track flex w-max">
          <LogoRow />
          <LogoRow ariaHidden />
        </div>
      </div>
    </section>
  );
}
