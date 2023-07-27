import { cookies } from "next/headers";
import { HttpLink } from "@apollo/client";
import {
  NextSSRInMemoryCache,
  NextSSRApolloClient,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { setContext } from "@apollo/client/link/context";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || "http://gateway/graphql";

export const { getClient } = registerApolloClient(() => {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        cookie: cookies()
          .getAll()
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join("; "),
      },
    };
  });

  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    credentials: "include",
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: authLink.concat(httpLink),
    defaultOptions: {
      query: {
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
    },
  });
});
