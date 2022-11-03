// next
import Link from "next/link";

// hooks
import useResponsive from "hooks/useResponsive";

// @mui
import { Divider, Box, Grid, Typography, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// components
import Iconify from "components/iconify";
import Image from "components/Image";

const PRIVACY_POLICY_URL = "https://www.iiit.ac.in/privacy-policy/";
const TWITTER_URL = "https://twitter.com/iiit_hyderabad";
const FACEBOOK_URL = "https://www.facebook.com/IIITH";
const INSTAGRAM_URL = "https://www.instagram.com/iiit.hyderabad/";
const DISCORD_URL = "https://discord.gg/V8C7QSRtat";

const IIITLogo = "assets/img/iiit_logo_white.png";
const CCLogo = "assets/vector/logo_full.svg";

export default function Footer() {
    const theme = useTheme();

    const isDesktop = useResponsive("up", "sm");
    const isLight = theme.palette.mode === "light";

    return (
        <Box>
            <Divider sx={{ py: 4 }} />
            <Grid container py={6} spacing={2} justifyContent="space-between">
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
                            sx={{ height: 50, filter: `invert(${isLight ? 100 : 0}%)` }}
                        />
                    </Box>
                    <Box>
                        <Image
                            src={CCLogo}
                            alt={"Clubs Council"}
                            sx={{ height: 50, filter: `invert(${isLight ? 100 : 0}%)` }}
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
            <Grid container>
                <Grid item xs>
                    <Typography variant="body1" fontWeight={500}>
                        © 2022, IIIT Hyderabad
                    </Typography>
                </Grid>
                <Grid item xs>
                    <Box width="100%" display="flex" justifyContent="flex-end">
                        <Link
                            href={PRIVACY_POLICY_URL}
                            underline="hover"
                            variant="body1"
                            fontWeight={500}
                        >
                            Privacy Policy
                        </Link>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}