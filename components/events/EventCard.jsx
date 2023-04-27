import { useRouter } from "next/router";
import PropTypes from "prop-types";

import { Box, Card, CardActionArea, Typography, Stack } from "@mui/material";

import Label from "components/label";
import EventPoster from "./EventPoster";
import { fDateTime } from "utils/formatTime";

EventCard.propTypes = {
    event: PropTypes.object,
};

export default function EventCard({ event }) {
    const { _id, name, datetimeperiod } = event;
    const router = useRouter();

    return (
        <Card>
            <CardActionArea onClick={() => router.push(`/events/${_id}`)}>
                <Box sx={{ pt: "100%", position: "relative" }}>
                    {event?.status?.state && (
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
                            {event?.status?.state}
                        </Label>
                    )}
                    <EventPoster event={event} />
                </Box>

                <Stack spacing={1} sx={{ p: 3 }}>
                    <Typography variant="subtitle2" fontSize={16} noWrap>
                        {name}
                    </Typography>
                    <Typography variant="caption" noWrap>
                        {fDateTime(
                            datetimeperiod?.[0],
                            // show year if event didn't happen this year
                            parseInt(fDateTime(datetimeperiod?.[0], "Y")) !==
                                parseInt(new Date().getFullYear())
                                ? "dd MMM Y, p"
                                : "dd MMM, p"
                        )}
                    </Typography>
                </Stack>
            </CardActionArea>
        </Card>
    );
}
