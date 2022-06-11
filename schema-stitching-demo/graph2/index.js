const ReviewsAPI = require('./reviews-api.js');
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`

"""Reviews for the book"""
 type Reviews{
   """Name of the reviewer"""
   reviewer: String
   """Book review"""
   text: String
 }

type Query {
  """Detail information for books"""
    productReviews(id: ID!): [Reviews]
  }
`;

const resolvers = {
  Query: {
    productReviews: async (_,args,{dataSources}) => {
      return dataSources.ReviewsAPI.getReviews(args.id);
    }
  }
};


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  dataSources: () => {
    return {
      ReviewsAPI: new ReviewsAPI(),
    };
  },
});

// The `listen` method launches a web server.
server.listen({port : 4002}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
