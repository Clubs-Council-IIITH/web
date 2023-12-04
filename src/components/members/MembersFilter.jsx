"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { useState, useEffect, useCallback } from "react";

import {
  Container,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

import { useToast } from "components/Toast";

export default function MembersFilter({ name, club, state, cc = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { triggerToast } = useToast();

  // get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // show both upcoming and completed if no state is selected
  useEffect(() => {
    if (state.length === 0)
      router.push(
        `${pathname}?upcoming=true&completed=true${club ? `&club=${club}` : ""}`
      );
  }, [state]);

  // fetch list of clubs
  const [clubs, setClubs] = useState([]);
  useEffect(() => {
    (async () => {
      let res = await fetch("/actions/clubs/ids");
      res = await res.json();
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
  
  return (
    <Container>
      <Grid container spacing={2}>
        {cc && (
          <Grid item xs={12} lg={8}>
            <FormControl fullWidth>
              <InputLabel id="clubid">Filter by club</InputLabel>
              <Select
                labelId="clubid"
                label="Filter by club"
                fullWidth
                onChange={(e) =>
                  router.push(
                    `${pathname}?${createQueryString("club", e.target.value)}`
                  )
                }
                value={club}
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
                  !state.includes(e.target.value)
                )}`
              );
            }}
          >
            <ToggleButton disableRipple key="upcoming" value="upcoming">
              Current Members
            </ToggleButton>
            <ToggleButton disableRipple key="completed" value="completed">
              Past Members
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Container>
  );
}
