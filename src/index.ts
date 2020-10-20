import 'reflect-metadata';

import dotenv from 'dotenv';
import {Container} from 'typedi';
import {buildSchema} from 'type-graphql';
import {ApolloServer} from 'apollo-server';
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

    const server = new ApolloServer({schema});

    const {url} = await server.listen({port: 8080});
    console.log('Server running at', url);
  } catch (e) {
    console.log('Server error:', e.message);
  }
};

bootstrap();
