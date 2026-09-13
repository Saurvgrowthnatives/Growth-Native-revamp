import Image from "next/image";

export function Logo() {
  return (
    <a href="/" className="flex shrink-0 items-center" aria-label="Growth Natives home">
      <Image
        src="/brand/growth-natives-logo.svg"
        alt="Growth Natives"
        width={254}
        height={70}
        priority
        className="h-8 w-auto sm:h-9"
      />
    </a>
  );
}
