import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        priority
        src="/cc-logo.svg"
        alt="Clubs Council"
        width={128}
        height={64}
      />
    </Link>
  );
}
