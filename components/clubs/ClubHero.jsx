import PropTypes from "prop-types";
import { capitalCase } from "change-case";

import { alpha, styled } from "@mui/material/styles";
import { Avatar, Box, Typography } from "@mui/material";
import { SocialIcon } from "react-social-icons";

import useResponsive from "hooks/useResponsive";

import Image from "components/Image";
import { downloadFile } from "utils/files";
import { mediaConstants } from "constants/media";

const OverlayStyle = styled("h1")(({ theme }) => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 9,
  margin: 0,
  position: "absolute",
  backgroundColor: alpha(theme.palette.grey[900], 0.7),
}));

const TitleStyle = styled("h1")(({ theme }) => ({
  ...theme.typography.h2,
  top: 0,
  zIndex: 10,
  width: "100%",
  position: "absolute",
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(8),
  },
}));

const FooterStyle = styled("div")(({ theme }) => ({
  bottom: 0,
  zIndex: 10,
  width: "100%",
  display: "flex",
  position: "absolute",
  alignItems: "flex-end",
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("sm")]: {
    alignItems: "center",
    paddingRight: theme.spacing(3),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(8),
  },
}));

ClubHero.propTypes = {
  club: PropTypes.object.isRequired,
};

function SocialMedia({ network, url, dims = 30, ...props }) {
  return (
    <SocialIcon
      network={network}
      title={capitalCase(network)}
      style={{ height: dims, width: dims, marginLeft: 10, marginTop: 10 }}
      fgColor="white"
      url={url}
      {...props}
    />
  );
}

export default function ClubHero({ club }) {
  const { banner, name, tagline, logo } = club;

  const isDesktop = useResponsive("up", "sm");

  return (
    <Box sx={{ position: "relative" }}>
      <TitleStyle>
        <Box display="flex" alignItems="center">
          <Avatar src={downloadFile(logo)} sx={{ mr: 3, border: 3, width: 64, height: 64 }} />
          {name}
        </Box>
      </TitleStyle>

      <FooterStyle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ color: "common.white" }}>
            {tagline}
          </Typography>
        </Box>

        <Box display="flex" flexDirection={isDesktop ? "row" : "column"}>
          {["instagram", "facebook", "youtube", "twitter", "linkedin", "discord"].map(
            (network, key) =>
              club?.[network] ? (
                <SocialMedia
                  key={key}
                  network={network}
                  url={club[network]}
                  dims={isDesktop ? 35 : 30}
                />
              ) : null,
          )}
        </Box>
      </FooterStyle>

      <OverlayStyle />
      <Image
        alt="club cover image"
        src={banner ? downloadFile(banner) : mediaConstants.placeholderImg}
        ratio={isDesktop ? "21/9" : "4/3"}
        sx={{
          filter: "blur(0.3em)",
        }}
      />
    </Box>
  );
}
