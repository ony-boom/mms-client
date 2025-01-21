import { ApolloClient, InMemoryCache } from "@apollo/client/core";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/graphql";

export const apolloClient = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});
