import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
// @mui
import { Box, Card, CardActionArea, Typography, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
// components
import Label from "components/label";
import { fDateTime } from "utils/formatTime";

// ----------------------------------------------------------------------

const StyledEventImg = styled("img")({
    top: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
});

// ----------------------------------------------------------------------

EventCard.propTypes = {
    event: PropTypes.object,
};

export default function EventCard({ event }) {
    const { club, name, poster, state, datetimeStart } = event;
    const router = useRouter();

    // blur club cover and set as poster if not uploaded
    const [clubCoverAsPoster, setClubCoverAsPoster] = useState(false);
    useEffect(() => {
        if (poster === null || poster === "") {
            setClubCoverAsPoster(true);
        }
    }, [poster]);

    return (
        <Card className="elevate">
            <CardActionArea onClick={() => router.push(`/events/${event.id}`)}>
                <Box sx={{ pt: "100%", position: "relative" }}>
                    {state && (
                        <Label
                            variant="filled"
                            color={(state === "A_6" && "error") || "info"}
                            sx={{
                                zIndex: 9,
                                top: 16,
                                right: 16,
                                position: "absolute",
                                textTransform: "uppercase",
                            }}
                        >
                            {state}
                        </Label>
                    )}
                    <StyledEventImg
                        alt={name}
                        src={clubCoverAsPoster ? club.img : poster}
                        sx={{
                            ...(clubCoverAsPoster ? { filter: "blur(0.3em)" } : {}),
                        }}
                    />
                </Box>

                <Stack spacing={1} sx={{ p: 3 }}>
                    <Typography variant="subtitle2" fontSize={16} noWrap>
                        {name}
                    </Typography>
                    <Typography variant="caption" noWrap>
                        {fDateTime(datetimeStart, "dd MMM, p")}
                    </Typography>
                </Stack>
            </CardActionArea>
        </Card>
    );
}
