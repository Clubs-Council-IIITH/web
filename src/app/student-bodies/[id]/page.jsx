/*
/* COPY OF `src/app/clubs/[id]/page.jsx`
*/

import { permanentRedirect, notFound } from "next/navigation";

import { getClient } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";

import Club from "app/clubs/[id]/page";

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

  if (!club?.studentBody) return permanentRedirect(`/clubs/${id}`);

  return {
    title: club.name,
  };
}

export default async function StudentBody({ params }) {
  return Club({ params });
}
