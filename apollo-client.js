import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const link = createHttpLink({
    uri: "/graphql",
    credentials: "include", // TODO: change to same-origin in prod
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
});

export default client;
