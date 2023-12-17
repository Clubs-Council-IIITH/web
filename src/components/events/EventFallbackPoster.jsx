"use client";

// import { getClient } from "gql/client";
import { GET_CLUB_STRING } from "gql/queries/clubs";

import EventPoster from "./EventPoster";

import { useEffect } from 'react'

const GRAPHQL_ENDPOINT = "http://localhost:80/graphql";

export default function EventFallbackPoster({ clubid, width, height }) {
  let club = {}

  useEffect(() => {
    const query = GET_CLUB_STRING;
    const variables = {
      clubInput: { cid: clubid },
    };
  
    const res = fetchData({query, variables})
    club = res?.data?.club
    console.log(club)
  }, [])

  return (
    <EventPoster
      name={club.name}
      poster={club.banner}
      width={width}
      height={height}
      style={{
        filter: "blur(0.3em)",
      }}
    />
  );
}

async function fetchData(queryPayload) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(queryPayload),
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  return response.json();
}