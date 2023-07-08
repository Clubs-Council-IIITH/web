import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useQuery } from "@apollo/client";
import { GET_ALL_CLUBS } from "gql/queries/clubs";

import { Button, Stack, Container, Typography } from "@mui/material";

import Page from "components/Page";
import Iconify from "components/iconify";

import ClientOnly from "components/ClientOnly";
import { ClubsTable } from "components/clubs/ClubsTable";

export default function Clubs() {
  const { asPath } = useRouter();
  const { loading, error, data: { allClubs: clubs } = {} } = useQuery(GET_ALL_CLUBS);

  // handle loading and error
  return (
    <Page title="Manage Clubs & Student Bodies">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h3" gutterBottom>
            Manage Clubs & Student Bodies
          </Typography>

          <Button
            component={Link}
            href={`${asPath}/new`}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Club
          </Button>
        </Stack>

        <ClientOnly>
          <ClubsTable clubs={clubs} />
        </ClientOnly>
      </Container>
    </Page>
  );
}
