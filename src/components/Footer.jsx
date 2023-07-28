"use client";

import Link from "next/link";
import Image from "next/image";

import { useTheme } from "@mui/material/styles";
import { Divider, Box, Grid, Typography, IconButton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import Icon from "components/Icon";

const PRIVACY_POLICY_URL = "https://www.iiit.ac.in/privacy-policy/";
const TWITTER_URL = "https://twitter.com/iiit_hyderabad";
const FACEBOOK_URL = "https://www.facebook.com/IIITH";
const INSTAGRAM_URL = "https://www.instagram.com/iiit.hyderabad/";
const DISCORD_URL = "https://discord.gg/V8C7QSRtat";

const IIITLogo = "/assets/iiit-logo-white.png";
const CCLogo = "/assets/cc-logo-black.svg";

export default function Footer() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box>
      <Divider sx={{ py: 4 }} />
      <Grid container py={5} spacing={2} justifyContent="space-between">
        <Grid
          item
          xs={12}
          lg
          display="flex"
          alignItems="center"
          justifyContent={isDesktop ? "flex-start" : "center"}
        >
          <Box mr={3}>
            <Image
              src={IIITLogo}
              alt={"IIIT Hyderabad"}
              height={50}
              width={99}
              style={{ filter: "invert(100%)" }}
            />
          </Box>
          <Box>
            <Image
              src={CCLogo}
              alt={"Clubs Council"}
              height={50}
              width={97}
              style={{ filter: "invert(100%)" }}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          lg
          display="flex"
          alignItems="center"
          justifyContent={isDesktop ? "flex-end" : "center"}
        >
          <IconButton
            component="a"
            href={DISCORD_URL}
            sx={{ mx: 1, color: "text.primary" }}
          >
            <Icon external variant="akar-icons:discord-fill" />
          </IconButton>
          <IconButton
            component="a"
            href={TWITTER_URL}
            sx={{ mx: 1, color: "text.primary" }}
          >
            <Icon external variant="akar-icons:twitter-fill" />
          </IconButton>
          <IconButton
            component="a"
            href={FACEBOOK_URL}
            sx={{ mx: 1, color: "text.primary" }}
          >
            <Icon external variant="akar-icons:facebook-fill" />
          </IconButton>
          <IconButton
            component="a"
            href={INSTAGRAM_URL}
            sx={{ mx: 1, color: "text.primary" }}
          >
            <Icon external variant="akar-icons:instagram-fill" />
          </IconButton>
        </Grid>
      </Grid>

      <Grid container px={isDesktop ? 0 : 2}>
        <Grid item xs>
          <Typography variant="body2" fontWeight={500}>
            © 2023, IIIT Hyderabad
          </Typography>
        </Grid>
        <Grid item xs>
          <Box width="100%" display="flex" justifyContent="flex-end">
            <Typography
              variant="body2"
              component={Link}
              href={PRIVACY_POLICY_URL}
              sx={{
                fontWeight: 600,
                textDecoration: "none",
                color: "black",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Privacy Policy
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
