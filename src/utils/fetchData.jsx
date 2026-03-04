"use server";

import { cache } from "react";
import { notFound } from "next/navigation";

import { getClient, combineQuery } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_CLUB } from "gql/queries/clubs";
import { GET_EVENT, GET_FULL_EVENT } from "gql/queries/events";
import { GET_USER_PROFILE } from "gql/queries/users";

export const getClub = cache(async (id) => {
  try {
    const { document, variables } = combineQuery('CombinedQuery')
      .add(GET_CLUB, {
        clubInput: { cid: id },
      });

    const { data: { club } = {} } = await getClient().query(document, variables);

    return club;
  } catch (error) {
    notFound();
  }
});

export const getEvent = cache(async (id) => {
  // console.log("Fetching event with id:", id);
  try {
    const { document, variables } = combineQuery('CombinedQuery')
      .add(GET_EVENT, {
        eventid: id,
      });

    const { data: { event } = {} } = await getClient().query(document, variables);

    return event;
  } catch (error) {
    notFound();
  }
});

export const getFullEvent = cache(async (id) => {
  // console.log("Fetching full event with id:", id);
  try {
    const { document, variables } = combineQuery('CombinedQuery')
      .add(GET_FULL_EVENT, {
        eventid: id,
      });

    const { data: { event } = {} } = await getClient().query(document, variables);

    return event;
  } catch (error) {
    notFound();
  }
});

export const getUserProfile = cache(async (id) => {
  const userInput = { uid: id };

  try {
    const { document, variables } = combineQuery('CombinedQuery')
      .add(GET_USER_PROFILE, { userInput });

    const { data: { userProfile, userMeta } = {} } = await getClient().query(document, variables);

    if (userProfile === null || userMeta === null) notFound();

    return { ...userMeta, ...userProfile };
  } catch (error) {
    notFound();
  }
});

export const getCurrentUser = cache(async () => {
  try {
    const { document, variables } = combineQuery('CombinedQuery')
      .add(GET_USER, { userInput: null });

    const { data: { userMeta, userProfile } = {} } = await getClient().query(document, variables);

    if (userMeta === null || userProfile === null) return null;

    return { ...userMeta, ...userProfile };
  } catch (error) {
    return null;
  }
});
