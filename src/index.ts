import 'reflect-metadata';

import dotenv from 'dotenv';
import express from 'express';
import {Container} from 'typedi';
import {buildSchema} from 'type-graphql';
import {ApolloServer} from 'apollo-server-express';
import {graphqlUploadExpress} from 'graphql-upload';
import {createConnection, useContainer} from 'typeorm';

const bootstrap = async () => {
  dotenv.config();

  try {
    useContainer(Container);
    await createConnection();

    const schema = await buildSchema({
      resolvers: [__dirname + '/resolvers/*.ts'],
      container: Container,
    });

    const app = express();
    app.use(graphqlUploadExpress());

    const server = new ApolloServer({schema, uploads: false});
    server.applyMiddleware({app, path: '/'});

    app.listen({port: 8080}, () => console.log('Server running...'));
  } catch (e) {
    console.log('Server error:', e.message);
  }
};

bootstrap();
