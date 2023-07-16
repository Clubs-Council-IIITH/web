import Link from "next/link";
import Image from "next/image";

const CCLogoColor = "/assets/cc-logo-color.svg";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        priority
        src={CCLogoColor}
        alt="Clubs Council"
        width={128}
        height={64}
      />
    </Link>
  );
}
