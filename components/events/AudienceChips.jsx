import { Chip, Grid } from "@mui/material";
import { audienceLabels } from "utils/formatEvent";

export default function AudienceChips({ audience }) {
  return (
    <Grid container spacing={1}>
      {audienceLabels(audience)?.map(({ name, color }) => (
        <Grid item key={name}>
          <Chip label={name} sx={{ color: `${color}.dark`, backgroundColor: `${color}.lighter` }} />
        </Grid>
      ))}
    </Grid>
  );
}
