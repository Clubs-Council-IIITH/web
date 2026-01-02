import { Container, Typography } from "@mui/material";

import LocalUsersGrid from "components/users/LocalUsersGrid";

export const metadata = {
  title: "New CC Team 24-25",
};

const new_team = [
  {
    uid: "prabhav.shetty",
    poc: false,
    roles: [
      {
        name: "Executive Secretary",
        startMy: [1, 2024],
        endMy: null,
      },
    ],
  },
  {
    uid: "shailender.goyal",
    poc: false,
    roles: [
      {
        name: "Executive Secretary",
        startMy: [1, 2024],
        endMy: null,
      },
    ],
  },
  {
    uid: "ketaki.shetye",
    poc: false,
    roles: [
      {
        name: "Joint Secretary",
        startMy: [1, 2024],
        endMy: null,
      },
    ],
  },
  {
    uid: "aanvik.bhatnagar",
    poc: false,
    roles: [
      {
        name: "Joint Secretary",
        startMy: [1, 2024],
        endMy: null,
      },
    ],
  },
  {
    uid: "kartik.vij",
    poc: false,
    roles: [
      {
        name: "Joint Secretary",
        startMy: [1, 2024],
        endMy: null,
      },
    ],
  },
  {
    uid: "agrim.mittal",
    poc: false,
    roles: [
      {
        name: "Joint Secretary",
        startMy: [1, 2024],
        endMy: null,
      },
    ],
  },
];

const advisors = [
  {
    uid: "bhav.beri",
    poc: false,
    roles: [
      {
        name: "Advisor",
        startMy: [1, 2024],
        endMy: null,
      },
    ],
  },
  {
    uid: "vrinda.agarwal",
    poc: false,
    roles: [
      {
        name: "Advisor",
        startMy: [1, 2024],
        endMy: null,
      },
    ],
  },
  {
    uid: "gnaneswar.kulindala",
    poc: false,
    roles: [
      {
        name: "Advisor",
        startMy: [1, 2024],
        endMy: null,
      },
    ],
  },
  {
    uid: "mihika.sanghi",
    poc: false,
    roles: [
      {
        name: "Advisor",
        startMy: [1, 2024],
        endMy: null,
      },
    ],
  },
  {
    uid: "divij.d",
    poc: false,
    roles: [
      {
        name: "Advisor",
        startMy: [1, 2024],
        endMy: null,
      },
    ],
  },
];

export default async function NewCCTeam2425() {
  return (
    <Container>
      <center>
        <Typography
          variant="h3"
          sx={{
            mb: 3,
          }}
        >
          New Clubs Council Team &apos;24-&apos;25 🎉
        </Typography>
      </center>
      <LocalUsersGrid users={new_team} />
      <center>
        <Typography
          variant="h4"
          sx={{
            mt: 3,
          }}
        >
          New Advisors
        </Typography>
      </center>
      <LocalUsersGrid users={advisors} />
    </Container>
  );
}
