import { Chip, Grid } from "@mui/material";

import { fToList } from "utils/formatAudience";

export default function AudienceChips({ audience }) {
    return (
        <Grid container spacing={1}>
            {fToList(audience).map(({ name, color }) => (
                <Grid item>
                    <Chip
                        label={name}
                        sx={{ color: `${color}.dark`, backgroundColor: `${color}.lighter` }}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
