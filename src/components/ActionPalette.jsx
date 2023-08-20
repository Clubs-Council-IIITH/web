import { Box, Stack, Divider } from "@mui/material";

export default function ActionPalette({
  left = [],
  right = [],
  leftProps = [],
  rightProps = [],
}) {
  return (
    <>
      <Stack direction="row" alignItems="center">
        <Stack direction="row">
          {left.map((Component, key) => (
            <Component sx={{ mr: 1 }} {...leftProps[key]} key={key} />
          ))}
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row">
          {right.map((Component, key) => (
            <Component sx={{ ml: 1 }} {...rightProps[key]} key={key} />
          ))}
        </Stack>
      </Stack>
      <Divider sx={{ borderStyle: "dashed", mt: 2, mb: 2 }} />
    </>
  );
}
