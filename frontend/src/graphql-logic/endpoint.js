import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { RestLink } from "apollo-link-rest";

// Documentation to refer to:
//      https://www.apollographql.com/docs/link/links/rest/

// setup endpoint
const restLink = new RestLink({ uri: "http://localhost:8000/" });

// setup client
export const client = new ApolloClient({
  link: restLink,
  cache: new InMemoryCache(),
});
