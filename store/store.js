import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const phoneIP = "172.20.10.2";
const wifiIP = "192.168.0.102";

// const link = new HttpLink({ uri: "http://" + wifiIP + ":4001/graphql" });
const hosted_link = new HttpLink({
    uri: "https://med-db-v1.herokuapp.com/graphql",
});

export const client = new ApolloClient({
    // uri or link (any one will do) -
    // uri: "http://" + wifiIP + ":4001/graphql",
    uri: "https://med-db-v1.herokuapp.com/graphql",
    link: hosted_link,
    cache: new InMemoryCache(),
});