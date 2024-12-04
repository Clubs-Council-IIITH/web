"use client";

import Link from "next/link";

import { Button, Container, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Icon from "components/Icon";

export default function NotFound() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Container
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
      }}
    >
      <Stack direction="column" spacing={4} alignItems="center">
        <Stack direction="row" spacing={3} alignItems="center">
          <Icon
            external
            variant="fluent-emoji-flat:person-shrugging"
            sx={{ width: 150, height: 150 }}
          />
          <Typography variant={isDesktop ? "h2" : "h3"}>
            404: Page not found.
          </Typography>
        </Stack>

        <Stack direction="column" spacing={2} alignItems="center">
          <Typography variant="body1">
            Are you sure you're at the right place?
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href="/"
              startIcon={<Icon variant="home-outline" />}
            >
              Go Home
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
