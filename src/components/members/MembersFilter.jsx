"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import { useToast } from "components/Toast";

export default function MembersFilter({
  club,
  state,
  elevated = false,
  clubs = null,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { triggerToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const isElevated = elevated;

  // get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  // show both current and past if no state is selected
  useEffect(() => {
    if (state.length === 0 && club)
      router.replace(
        `${pathname}?current=true&past=false${club ? `&club=${club}` : ""}`,
        { scroll: false },
      );
  }, [state, club, pathname, router]);

  // fetch list of clubs if not provided by server
  return (
    <Container sx={{ opacity: isPending ? 0.7 : 1, transition: "opacity 0.2s" }}>
      <Grid container spacing={2}>
        {isElevated && (
          <Grid
            size={{
              xs: 12,
              lg: club ? 8 : 12,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="clubid">Filter by club</InputLabel>
              <Select
                labelId="clubid"
                label="Filter by club"
                fullWidth
                disabled={isPending}
                onChange={(e) =>
                  startTransition(() => {
                    router.replace(
                      `${pathname}?${createQueryString("club", e?.target?.value)}`,
                      { scroll: false },
                    );
                  })
                }
                value={clubs.some((c) => c.cid === club) ? club : ""}
              >
                {clubs
                  ?.slice()
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  ?.map((club) => (
                    <MenuItem key={club.cid} value={club.cid}>
                      {club.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        {club ? (
          <Grid
            size={{
              xs: "grow",
              lg: "grow",
            }}
          >
            <ToggleButtonGroup
              fullWidth
              value={state}
              color="primary"
              disabled={isPending}
              sx={{ height: "100%" }}
              onChange={(e) => {
                // don't do anything if all states are being unselected
                if (state.length === 1 && state.includes(e?.target?.value))
                  return;

                startTransition(() => {
                  router.replace(
                    `${pathname}?${createQueryString(
                      e?.target?.value,
                      !state.includes(e?.target?.value),
                    )}`,
                    { scroll: false },
                  );
                });
              }}
            >
              <ToggleButton disableRipple key="current" value="current">
                Current Members
              </ToggleButton>
              <ToggleButton disableRipple key="past" value="past">
                Past Members
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        ) : null}
      </Grid>
    </Container>
  );
}
