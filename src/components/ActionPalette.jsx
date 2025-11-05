import { Box, Grid, Divider } from "@mui/material";

export default function ActionPalette({
  left = [],
  right = [],
  leftProps = [],
  rightProps = [],
  downloadbtn = "",
  rightJustifyMobile = "center",
}) {
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        direction={{ xs: "column-reverse", md: "row" }}
        spacing={2}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Grid
          container
          xs={12}
          md={6}
          spacing={1}
          sx={{
            justifyContent: { xs: "center", md: "flex-start" },
            alignItems: "center",
            my: 0.5,
          }}
        >
          {left.map((Component, key) => (
            <Grid xs="auto">
              <Component {...leftProps[key]} key={key} />
            </Grid>
          ))}
        </Grid>

        <Grid
          container
          xs={12}
          md={6}
          spacing={1}
          sx={{
            justifyContent: { xs: rightJustifyMobile, md: "flex-end" },
            alignItems: "center",
            my: 0.5,
          }}
        >
          {right.map((Component, key) => (
            <Grid>
              <Component {...rightProps[key]} key={key} />
            </Grid>
          ))}
          {downloadbtn ? <Grid>{downloadbtn}</Grid> : ""}
        </Grid>
      </Grid>
      <Divider sx={{ borderStyle: "dashed", mt: 2, mb: 2 }} />
    </Box>
  );
}
