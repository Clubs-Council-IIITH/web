import { cookies } from "next/headers";
import { cacheExchange, createClient, fetchExchange } from "urql/core";
import { registerUrql } from "@urql/next/rsc";

const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || "http://gateway/graphql";

const makeClient = async () => {
  const cookieList = await cookies().getAll();
  const cookieHeader = cookieList.length
    ? cookieList.map((c) => `${c.name}=${c.value}`).join("; ")
    : undefined;

  return createClient({
    url: GRAPHQL_ENDPOINT,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      cache: "no-store",
      credentials: "include",
      headers: {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
    },
  });
};

export const { getClient } = registerUrql(makeClient);
