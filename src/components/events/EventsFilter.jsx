"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { useState, useEffect, useCallback } from "react";

import {
  Button,
  Container,
  TextField,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ToggleButtonGroup,
  InputAdornment,
  ToggleButton,
  Stack,
} from "@mui/material";

import { useToast } from "components/Toast";
import Icon from "components/Icon";

import { getActiveClubIds } from "actions/clubs/ids/server_action";

export default function EventsFilter({ name, club, state }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { triggerToast } = useToast();

  // get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);

      if (
        !params.has("upcoming") &&
        !params.has("completed") &&
        ["upcoming", "completed"].includes(name)
      ) {
        params.set("upcoming", "true");
        params.set("completed", "true");
      }

      if (value != "") params.set(name, value);
      else params.delete(name);

      return params.toString();
    },
    [searchParams],
  );

  // fetch list of clubs
  const [clubs, setClubs] = useState([]);
  useEffect(() => {
    (async () => {
      let res = await getActiveClubIds();
      if (!res.ok) {
        triggerToast({
          title: "Unable to fetch clubs",
          messages: res.error.messages,
          severity: "error",
        });
      } else {
        setClubs(res.data);
      }
    })();
  }, []);

  // track name field
  const [targetName, setTargetName] = useState(name || "");

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            component="form"
            direction="row"
            spacing={1}
            onSubmit={(e) => {
              e.preventDefault();
              router.push(
                `${pathname}?${createQueryString("name", targetName)}`,
              );
            }}
          >
            <TextField
              label="Search by name"
              autoComplete="off"
              variant="outlined"
              fullWidth
              onChange={(e) => setTargetName(e.target.value)}
              value={targetName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon variant="search" />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained">
              Search
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} lg={8}>
          <FormControl fullWidth>
            <InputLabel id="clubid">Filter by Club/Student Body</InputLabel>
            <Select
              labelId="clubid"
              label="Filter by Club/Student Body"
              fullWidth
              onChange={(e) => {
                router.push(
                  `${pathname}?${createQueryString("club", e.target.value)}`,
                );
              }}
              value={club || ""}
            >
              <MenuItem key="all" value="">
                All Clubs
              </MenuItem>
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
        <Grid item xs lg>
          <ToggleButtonGroup
            fullWidth
            value={state}
            color="primary"
            sx={{ height: "100%" }}
            onChange={(e) => {
              // don't do anything if all states are being unselected
              if (state.length === 1 && state.includes(e.target.value)) return;

              return router.push(
                `${pathname}?${createQueryString(
                  e.target.value,
                  !state.includes(e.target.value),
                )}`,
              );
            }}
          >
            <ToggleButton disableRipple key="upcoming" value="upcoming">
              Upcoming
            </ToggleButton>
            <ToggleButton disableRipple key="completed" value="completed">
              Completed
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Container>
  );
}
