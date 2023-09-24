import { Box, Grid, Divider } from "@mui/material";

export default function ActionPalette({
  left = [],
  right = [],
  leftProps = [],
  rightProps = [],
}) {
  return (
    <Box width="100%">
      <Grid
        container
        direction={{ xs: "column-reverse", md: "row" }}
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid
          item
          container
          xs={12}
          md={6}
          spacing={1}
          justifyContent={{ xs: "center", md: "flex-start" }}
          alignItems="center"
          my={0.5}
        >
          {left.map((Component, key) => (
            <Grid item xs="auto">
              <Component {...leftProps[key]} key={key} />
            </Grid>
          ))}
        </Grid>

        <Grid
          item
          container
          xs={12}
          md={6}
          spacing={1}
          justifyContent={{ xs: "center", md: "flex-end" }}
          alignItems="center"
          my={0.5}
        >
          {right.map((Component, key) => (
            <Grid item>
              <Component {...rightProps[key]} key={key} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Divider sx={{ borderStyle: "dashed", mt: 2, mb: 2 }} />
    </Box>
  );
}
