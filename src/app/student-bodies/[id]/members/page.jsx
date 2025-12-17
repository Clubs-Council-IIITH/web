/*
/* COPY OF `src/app/clubs/[id]/members/page.jsx`
*/

import { permanentRedirect, notFound } from "next/navigation";

import { getClub } from "utils/fetchData";

import ClubMembers from "app/clubs/[id]/members/page";

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = params;

  const club = await getClub(id);
  if (club?.category != "body")
    return permanentRedirect(`/clubs/${id}/members`);

  return {
    title: `Members | ${club.name}`,
  };
}

export default async function BodyMembers(props) {
  const params = await props.params;
  return ClubMembers({ params });
}
