/*
/* COPY OF `src/app/clubs/[id]/page.jsx`
*/

import { permanentRedirect } from "next/navigation";

import { getClub } from "utils/fetchData";

import Club from "app/clubs/[id]/page";

export async function generateMetadata({ params }) {
  const { id } = params;

  const club = await getClub(id);
  if (club?.category != "body") return permanentRedirect(`/clubs/${id}`);

  return {
    title: club.name,
  };
}

export default async function StudentBody({ params }) {
  return Club({ params });
}
