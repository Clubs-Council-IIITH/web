import { NextResponse } from "next/server";

import { getClient } from "gql/client";
import { APPLY_FOR_CC } from "gql/mutations/recruitments";

export async function POST(request) {
  const response = { ok: false, error: null };
  const { ccRecruitmentInput } = await request.json();

  const { error } = await getClient().mutation(APPLY_FOR_CC, {
    ccRecruitmentInput,
  });
  if (error) {
    response.error = {
      title: error.name,
      messages: error?.graphQLErrors?.map((ge) => ge?.message),
    };
  } else {
    response.ok = true;
  }

  return NextResponse.json(response);
}
