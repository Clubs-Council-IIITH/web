import Link from "next/link";

import useResponsive from "hooks/useResponsive";

import { Divider, Box, Grid, Typography, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Iconify from "components/iconify";
import Image from "components/Image";
import { useMode } from "contexts/ModeContext";

const PRIVACY_POLICY_URL = "https://www.iiit.ac.in/privacy-policy/";
const TWITTER_URL = "https://twitter.com/iiit_hyderabad";
const FACEBOOK_URL = "https://www.facebook.com/IIITH";
const INSTAGRAM_URL = "https://www.instagram.com/iiit.hyderabad/";
const DISCORD_URL = "https://discord.gg/V8C7QSRtat";

const IIITLogo = "/assets/img/iiit_logo_white.png";
const CCLogo = "/assets/vector/logo_full_iiith.svg";

export default function Footer() {
    const theme = useTheme();

    const isDesktop = useResponsive("up", "lg");
    const { isLight } = useMode();

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
                            priority
                            src={IIITLogo}
                            alt={"IIIT Hyderabad"}
                            sx={{ height: 50, width: 99, filter: `invert(${isLight ? 100 : 0}%)` }}
                        />
                    </Box>
                    <Box>
                        <Image
                            priority
                            src={CCLogo}
                            alt={"Clubs Council"}
                            sx={{ height: 50, width: 97, filter: `invert(${isLight ? 100 : 0}%)` }}
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
                        <Iconify icon="akar-icons:discord-fill" />
                    </IconButton>
                    <IconButton
                        component="a"
                        href={TWITTER_URL}
                        sx={{ mx: 1, color: "text.primary" }}
                    >
                        <Iconify icon="akar-icons:twitter-fill" />
                    </IconButton>
                    <IconButton
                        component="a"
                        href={FACEBOOK_URL}
                        sx={{ mx: 1, color: "text.primary" }}
                    >
                        <Iconify icon="akar-icons:facebook-fill" />
                    </IconButton>
                    <IconButton
                        component="a"
                        href={INSTAGRAM_URL}
                        sx={{ mx: 1, color: "text.primary" }}
                    >
                        <Iconify icon="akar-icons:instagram-fill" />
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
                            component={Link}
                            href={PRIVACY_POLICY_URL}
                            underline="hover"
                            variant="body2"
                            fontWeight={500}
                        >
                            Privacy Policy
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
