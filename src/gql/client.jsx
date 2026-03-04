import { cookies } from "next/headers";

import { registerUrql } from "@urql/next/rsc";
import { cacheExchange, createClient, fetchExchange } from "urql/core";

const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || "http://gateway/graphql";

const makeClient = async () => {
  const cookieList = (await cookies()).getAll();
  const cookieHeader = cookieList.length
    ? cookieList.map((c) => `${c.name}=${c.value}`).join("; ")
    : undefined;

  return createClient({
    url: GRAPHQL_ENDPOINT,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      cache: "force-cache",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
    },
  });
};

const { getClient: _rscGetClient } = registerUrql(makeClient);

export const getClient = (useCookies = true) => {
  return {
    query: async (document, variables, options = {}) => {
      const client = await _rscGetClient();
      
      let cookieHeader;
      if (useCookies) {
        const cookieList = (await cookies()).getAll();
        cookieHeader = cookieList.map((c) => `${c.name}=${c.value}`).join("; ");
      }

      return await client
        .query(document, variables, {
          requestPolicy: options.requestPolicy || 'cache-first',
          ...options,
          fetchOptions: {
            cache: "force-cache",
            ...options.fetchOptions,
            headers: {
              "content-type": "application/json",
              ...(cookieHeader ? { cookie: cookieHeader } : {}),
              ...options.fetchOptions?.headers,
            },
          },
        })
        .toPromise();
    },
    mutation: async (document, variables, options = {}) => {
      const client = await _rscGetClient();
      return await client.mutation(document, variables, options).toPromise();
    },
  };
};
