import { useRouter } from "next/router";
import PropTypes from "prop-types";

// @mui
import { Box, Card, CardActionArea, Typography, Stack } from "@mui/material";

// components
import Label from "components/label";
import EventPoster from "./EventPoster";
import { fDateTime } from "utils/formatTime";

EventCard.propTypes = {
    event: PropTypes.object,
};

export default function EventCard({ event }) {
    const { name, state, datetimeStart } = event;
    const router = useRouter();

    return (
        <Card>
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
                    <EventPoster event={event} />
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
