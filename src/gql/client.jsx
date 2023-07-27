import { cookies } from "next/headers";
import { cacheExchange, createClient, fetchExchange } from "urql/core";

const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || "http://gateway/graphql";

let _client = null;
export const getClient = () => {
  if (!_client) {
    _client = createClient({
      url: GRAPHQL_ENDPOINT,
      requestPolicy: "cache-and-network",
      exchanges: [cacheExchange, fetchExchange],
      fetchOptions: {
        credentials: "include",
        headers: {
          cookie: cookies()
            .getAll()
            .map((cookie) => `${cookie.name}=${cookie.value}`)
            .join("; "),
        },
      },
    });
  }
  const client = _client;
  return client;
};
