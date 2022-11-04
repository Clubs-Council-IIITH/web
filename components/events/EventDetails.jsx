import { Box, Divider, Typography } from "@mui/material";
import { fDateTime } from "utils/formatTime";

import Iconify from "components/iconify";
import AudienceChips from "./AudienceChips";
import { ClubBanner } from "components/clubs";

export default function EventDetails({ event }) {
    const { club, name, description, audience, datetimeStart, datetimeEnd } = event;

    return (
        <Box p={3}>
            <Box display="flex" alignItems="center">
                <Iconify icon="ic:outline-calendar-today" sx={{ mr: 2, width: 16 }} />
                <Typography variant="body2">
                    {fDateTime(datetimeStart, "dd MMM, p")} — {fDateTime(datetimeEnd, "dd MMM, p")}
                </Typography>
            </Box>

            <Typography variant="h3" paragraph mt={1}>
                {name}
            </Typography>

            <ClubBanner club={club} />

            <Box display="flex" mt={4} alignItems="center">
                <Iconify icon="ic:outline-location-on" sx={{ mr: 2 }} />
                <Typography variant="body1">Himalaya 105</Typography>
            </Box>

            <Box display="flex" mt={3} alignItems="center">
                <Iconify icon="ic:outline-people-alt" sx={{ mr: 2 }} />
                <AudienceChips audience={audience} />
            </Box>

            <Divider sx={{ borderStyle: "dashed", my: 3 }} />

            <Typography variant="body" paragraph>
                {description}
            </Typography>
        </Box>
    );
}
