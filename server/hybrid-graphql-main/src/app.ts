require('dotenv').config();
import express, {Request, Response} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import {notFound, errorHandler} from './middlewares';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import typeDefs from './api/schemas/index';
import resolvers from './api/resolvers/index';
import {MessageResponse} from '@sharedTypes/MessageTypes';
import {
  ApolloServerPluginLandingPageLocalDefault,
  //ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import {MyContext} from './local-types';
import {authenticate} from './lib/functions';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {
  constraintDirectiveTypeDefs,
  createApollo4QueryValidationPlugin,
} from 'graphql-constraint-directive/apollo4';

const app = express();

(async () => {
  try {
    app.use(
      helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: false,
      }),
    );

    app.get('/', (_req: Request, res: Response<MessageResponse>) => {
      res.send({message: 'Server is running'});
    });

    // create executable schema for validation
    const schema = makeExecutableSchema({
      typeDefs: [constraintDirectiveTypeDefs, typeDefs],
      resolvers,
    });

    const server = new ApolloServer<MyContext>({
      schema,
      introspection: true,
      plugins: [
        createApollo4QueryValidationPlugin({schema}),
        ApolloServerPluginLandingPageLocalDefault(),
      ],
    });

    await server.start();

    app.use(
      '/graphql',
      cors(),
      express.json(),
      expressMiddleware(server, {
        context: ({req}) => authenticate(req),
      }),
    );

    app.use(notFound);
    app.use(errorHandler);
  } catch (error) {
    console.error((error as Error).message);
  }
})();

export default app;
