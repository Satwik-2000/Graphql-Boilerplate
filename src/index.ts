import {
  ApolloServer,
  ApolloServerExpressConfig,
  makeExecutableSchema,
} from "apollo-server-express";
import express from "express";
import { applyMiddleware } from "graphql-middleware";
import { createServer } from "http";
import { fileLoader, mergeTypes } from "merge-graphql-schemas";
import path from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
import resolvers from "./graphql/resolvers";

const app = express();

const schemaArray = fileLoader(path.join(__dirname, "./graphql/schema/"));
const typeDefs = mergeTypes(schemaArray);

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers,
  })
);

const httpServer = createServer(app);
const config: ApolloServerExpressConfig = {
  schema,
};

const server = new ApolloServer(config);
server.installSubscriptionHandlers(httpServer);

createConnection()
  .then(async () => {
    console.log("Postgres Connected!!");
    server.applyMiddleware({ app });

    httpServer.listen(4000, async () => {
      console.log("Server started on localhost:4000");
    });
  })
  .catch((error) => console.error(error));
