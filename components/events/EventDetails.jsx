import { Box, Divider, Typography } from "@mui/material";
import { fDateTime } from "utils/formatTime";

import Iconify from "components/iconify";
import AudienceChips from "./AudienceChips";
import { ClubBanner } from "components/clubs";

export default function EventDetails({
    club,
    name,
    description,
    audience,
    datetimeperiod,
    location,
}) {
    return (
        <Box p={3}>
            <Box display="flex" alignItems="center">
                <Iconify icon="ic:outline-calendar-today" sx={{ mr: 2, width: 16 }} />
                <Typography variant="body2">
                    {fDateTime(datetimeperiod?.[0], "dd MMM, p")}
                </Typography>
                <Box mx={1}>-</Box>
                <Typography variant="body2">
                    {fDateTime(datetimeperiod?.[1], "dd MMM, p")}
                </Typography>
            </Box>

            <Typography variant="h3" paragraph mt={1}>
                {name}
            </Typography>

            <ClubBanner {...club} />

            <Box display="flex" mt={4} alignItems="center">
                <Iconify icon="ic:outline-location-on" sx={{ mr: 2 }} />
                {/* TODO: only the first location item is shown, is this right? */}
                <Typography variant="body1">{location?.[0]}</Typography>
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
