import { useRouter } from "next/router";
import PropTypes from "prop-types";

import { alpha, styled } from "@mui/material/styles";
import { Link, Card, CardActionArea, Grid, Typography, CardContent } from "@mui/material";
import { downloadFile } from "utils/files";
import { mediaConstants } from "constants/media";

const StyledCardMedia = styled("div")({
    position: "relative",
    paddingTop: "calc(100% * 3 / 4)",
});

const StyledTitle = styled(Link)({
    overflow: "hidden",
    WebkitLineClamp: 2,
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
});

const StyledCover = styled("img")({
    top: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
});

ClubCard.propTypes = {
    club: PropTypes.object.isRequired,
    index: PropTypes.number,
};

export default function ClubCard({ club, index, url }) {
    const { cid, banner, name, tagline } = club;
    const router = useRouter();

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ position: "relative" }}>
                <CardActionArea onClick={() => router.push(url || `/clubs/${cid}`)}>
                    <StyledCardMedia
                        sx={{
                            pt: "100%",
                            "&:after": {
                                top: 0,
                                content: "''",
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.3),
                            },
                        }}
                    >
                        <StyledCover
                            loading="lazy"
                            alt={name}
                            src={banner ? downloadFile(banner) : mediaConstants.placeholderImg}
                        />
                    </StyledCardMedia>

                    <CardContent sx={{ pt: 4, bottom: 0, width: "100%", position: "absolute" }}>
                        <StyledTitle
                            color="inherit"
                            variant="subtitle2"
                            underline="none"
                            sx={{
                                typography: "h5",
                                color: "common.white",
                            }}
                        >
                            {name}
                        </StyledTitle>

                        <Typography
                            gutterBottom
                            variant="caption"
                            sx={{ color: "text.disabled", display: "block", fontSize: 14 }}
                        >
                            {tagline}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
}
