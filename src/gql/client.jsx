import { cookies } from "next/headers";
import { cacheExchange, createClient, fetchExchange } from "urql/core";
import { registerUrql } from "@urql/next/rsc";

const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || "http://gateway/graphql";

const makeClient = () => {
  return createClient({
    url: GRAPHQL_ENDPOINT,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      cache: "no-store",
      credentials: "include",
      headers: {
        cookie: cookies()
          .getAll()
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join("; "),
      },
    },
  });
};

export const { getClient } = registerUrql(makeClient);
