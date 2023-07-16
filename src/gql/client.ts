import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import {
  NextSSRInMemoryCache,
  NextSSRApolloClient,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || "http://localhost/graphql";

export const { getClient } = registerApolloClient(() => {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
    }),
  });
});
