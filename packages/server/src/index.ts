import { ApolloServer, gql } from 'apollo-server-express';
import * as express from 'express';
import { IResolvers } from 'graphql-tools';

const typeDefs = gql`
  type Query {
    hello(name: String!): String
  }
`;

const resolvers: IResolvers = {
  Query: {
    hello: (_, { name }) => `Hello World! ${name}`,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

server.applyMiddleware({
  app,
  cors: {
    credentials: true,
    origin: 'http://localhost:3000',
  },
});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
