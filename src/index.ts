import 'reflect-metadata';

import dotenv from 'dotenv';
import express from 'express';
import {buildSchema} from 'type-graphql';
import {createConnection} from 'typeorm';
import {ApolloServer} from 'apollo-server-express';
import {graphqlUploadExpress} from 'graphql-upload';

import {Auth} from './helpers';

const bootstrap = async () => {
  dotenv.config();

  try {
    await createConnection();

    const schema = await buildSchema({
      authChecker: Auth.authChecker,
      resolvers: [__dirname + '/resolvers/*.ts'],
    });

    const app = express();
    app.use(graphqlUploadExpress());

    const server = new ApolloServer({
      schema,
      uploads: false,
      context: Auth.mapContext,
    });
    server.applyMiddleware({app, path: '/'});

    app.listen({port: 8080}, () => console.log('Server running...'));
  } catch (e) {
    console.log('Server error:', e.message);
  }
};

bootstrap();
