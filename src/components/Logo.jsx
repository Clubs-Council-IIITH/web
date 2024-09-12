import Link from "next/link";
import Image from "next/image";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const CCLogoColor = "/assets/cc-logo-full-color.svg";

export default function Logo() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Link href="/">
      <Image
        priority={isDesktop}
        src={CCLogoColor}
        alt="Clubs Council Logo"
        width={128}
        height={64}
      />
    </Link>
  );
}
