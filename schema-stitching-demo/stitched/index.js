import Express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeRemoteExecutableSchema, mergeSchemas, introspectSchema } from 'graphql-tools';
import { HttpLink } from 'apollo-link-http';

const PRODUCT_API_URL = 'http://localhost:4001'; // metaweather graphql api
const REVIEWS_API_URL = 'http://localhost:4002';

async function run() {

  const createRemoteSchema = async (uri) => {
    const link = new HttpLink({uri: uri, fetch});
    const schema = await introspectSchema(link);
    return makeRemoteExecutableSchema({
      schema,
      link,
    });
  };

  const executableProductSchema = await createRemoteSchema(PRODUCT_API_URL);
  const executableReviewsSchema = await createRemoteSchema(REVIEWS_API_URL);

  const stitchedResolvers = {
    Product: {
      reviews : {
        resolve(parent, args, context, info) {
          return info.mergeInfo.delegateToSchema({
            schema: executableReviewsSchema,
            operation: 'query',
            fieldName: 'productReviews',
            args: {
              id: parent.id,
            },
            context,
            info,
          });
        },
      },
    },
  };

// extend author to have city_weather data
  const stitchedTypeDefs = `
    extend type Product {
      reviews: [Reviews]
    }
  `;

  const finalSchema = mergeSchemas({
    schemas: [
      executableProductSchema,
      executableReviewsSchema,
      stitchedTypeDefs
    ],
    resolvers: stitchedResolvers
  });

  const app = new Express();

  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: finalSchema}));

  app.use('/graphiql',graphiqlExpress({endpointURL: '/graphql'}));

  app.listen(4003);
  console.log('Server running. Open http://localhost:4003/graphiql to run queries.');
} // end of async run

try {
  run();
} catch (e) {
  console.log(e, e.message, e.stack);
}
