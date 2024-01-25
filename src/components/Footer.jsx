"use client";

import Link from "next/link";
import Image from "next/image";

import { useTheme } from "@mui/material/styles";
import {
  Stack,
  Divider,
  Box,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import Icon from "components/Icon";

const PRIVACY_POLICY_URL = "https://www.iiit.ac.in/privacy-policy/";
const TWITTER_URL = "https://twitter.com/iiit_hyderabad";
const FACEBOOK_URL = "https://www.facebook.com/IIITH";
const INSTAGRAM_URL = "https://www.instagram.com/iiit.hyderabad/";
const DISCORD_URL = "https://discord.gg/V8C7QSRtat";
const EMAIL_URL = "mailto:clubs@iiit.ac.in";

const IIITLogo = "/assets/iiit-logo-white.png";
const CCLogo = "/assets/cc-logo-full-black.svg";

export default function Footer() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

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
            target="_blank"
            href={EMAIL_URL}
            sx={{ mx: 1, color: "text.primary" }}
          >
            <Icon external variant="akar-icons:envelope" />
          </IconButton>
          <IconButton
            component="a"
            target="_blank"
            href={DISCORD_URL}
            sx={{ mx: 1, color: "text.primary" }}
          >
            <Icon external variant="akar-icons:discord-fill" />
          </IconButton>
          <IconButton
            component="a"
            target="_blank"
            href={TWITTER_URL}
            sx={{ mx: 1, color: "text.primary" }}
          >
            <Icon external variant="akar-icons:twitter-fill" />
          </IconButton>
          <IconButton
            component="a"
            target="_blank"
            href={FACEBOOK_URL}
            sx={{ mx: 1, color: "text.primary" }}
          >
            <Icon external variant="akar-icons:facebook-fill" />
          </IconButton>
          <IconButton
            component="a"
            target="_blank"
            href={INSTAGRAM_URL}
            sx={{ mx: 1, color: "text.primary" }}
          >
            <Icon external variant="akar-icons:instagram-fill" />
          </IconButton>
        </Grid>
      </Grid>

      {
        isDesktop ? (
          <Stack direction="row" spacing={1}>
            <Typography variant="body2" fontWeight={500}>
              © {new Date().getFullYear()}, IIIT Hyderabad
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                textDecoration: "none",
                color: "black",
                // "&:hover": {
                //   textDecoration: "underline",
                // },
              }}
            >
              Developed & Maintained with ❤️ by SLC Tech Team {/*(powered by <Typography
                variant="body2"
                component={Link}
                href={"https://clubs.iiit.ac.in/"}
                sx={{
                  fontWeight: 500,
                  textDecoration: "none",
                  color: "black",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Clubs Council
              </Typography>)*/}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Typography
              variant="body2"
              component={Link}
              href="/changelog"
              sx={{
                fontWeight: 600,
                textDecoration: "none",
                color: "black",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Changelog
            </Typography>
            <Box mx={1}>·</Box>
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
          </Stack>
        ) : (
          <>
            <Grid 
              display="flex"
              alignItems="center"
                justifyContent={"center"}
                mb={isTablet ? 2 : 0}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  textDecoration: "none",
                  color: "black",
                  // "&:hover": {
                  //   textDecoration: "underline",
                  // },
                }}
              >
                 Developed & Maintained with ❤️ by SLC Tech Team {/*(powered by <Typography
                  variant="body2"
                  component={Link}
                  href={"https://clubs.iiit.ac.in/"}
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "black",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Clubs Council
                </Typography>) */}
              </Typography>
            </Grid>

            <Stack direction="row" spacing={1}>
              <Typography variant="body2" fontWeight={500}>
                © {new Date().getFullYear()}, IIIT Hyderabad
              </Typography>

              <Box sx={{ flexGrow: 1 }} />

              <Typography
                variant="body2"
                component={Link}
                href="/changelog"
                sx={{
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "black",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Changelog
              </Typography>
              <Box mx={1}>·</Box>
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
            </Stack>
          </>
        )}
    </Box>
  );
}
