import { Box, Stack, Divider } from "@mui/material";

export default function ActionPalette({ left = [], right = [] }) {
  return (
    <>
      <Stack direction="row">
        <Stack direction="row">
          {left.map((Component) => (
            <Component sx={{ mr: 1 }} />
          ))}
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row">
          {right.map((Component) => (
            <Component sx={{ ml: 1 }} />
          ))}
        </Stack>
      </Stack>
      <Divider sx={{ borderStyle: "dashed", mt: 1, mb: 3 }} />
    </>
  );
}
