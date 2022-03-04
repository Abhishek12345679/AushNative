import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';

const wifiIP = '192.168.0.101';
const link = new HttpLink({uri: 'http://' + wifiIP + ':4001/graphql'});

const hosted_link = new HttpLink({
  uri: 'https://med-db-v1.herokuapp.com/graphql',
});

export const client = new ApolloClient({
  // uri: 'http://' + wifiIP + ':4001/graphql', // local
  uri: 'https://med-db-v1.herokuapp.com/graphql',
  // link: link,
  link: hosted_link,
  cache: new InMemoryCache(),
});
