import { Box, Stack, Container, Typography } from "@mui/material";
import { ModeSwitch } from "components/ModeSwitch";
import Page from "components/Page";

import { useMode } from "contexts/ModeContext";

export default function Settings() {
  const { isLight, changeMode } = useMode();

  return (
    <Page title="Settings">
      <Container>
        <Typography variant="h3" gutterBottom>
          Settings
        </Typography>

        <Stack direction="column" mt={5}>
          <Typography color="text.secondary" variant="h5" gutterBottom>
            Appearance and Layout
          </Typography>

          <Box mt={2}>
            <Typography variant="body" mr={2}>
              Global theme
            </Typography>
            <ModeSwitch checked={!isLight} onChange={changeMode} />
          </Box>
        </Stack>
      </Container>
    </Page>
  );
}
