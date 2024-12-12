/*
/* COPY OF `src/app/clubs/[id]/members/page.jsx`
*/

import { getClient } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";
import { permanentRedirect, notFound } from "next/navigation";

import ClubMembers from "app/clubs/[id]/members/page";

export async function generateMetadata({ params }) {
  const { id } = params;

  let club;

  try {
    const { data: { club: fetchedClub } = {} } = await getClient().query(
      GET_CLUB,
      {
        clubInput: { cid: id },
      }
    );

    club = fetchedClub;
  } catch (error) {
    notFound();
    return;
  }

  if (!club?.studentBody) return permanentRedirect(`/clubs/${id}/members`);

  return {
    title: `Members | ${club.name}`,
  };
}

export default function BodyMembers({ params }) {
  return ClubMembers({ params });
}
