import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { forwardRef } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { Box } from "@mui/material";
import { useMode } from "contexts/ModeContext";

const CCLogo = "/assets/vector/logo_full_coloured_iiith.svg";

const Logo = forwardRef(({ disabledLink = false, sx }, ref) => {
  const theme = useTheme();

  const { isLight } = useMode();

  const logo = (
    <Box ref={ref} sx={{ width: 128, height: 64, cursor: "pointer", py: 1, ...sx }}>
      <Image
        priority
        src={CCLogo}
        alt={"Clubs Council"}
        width={128}
        height={64}
        sx={{ filter: `invert(${isLight ? 100 : 0}%)` }}
      />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <NextLink href="/">{logo}</NextLink>;
});

Logo.displayName = "Logo";
Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
