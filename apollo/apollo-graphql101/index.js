const ProductAPI = require('./products-api.js');
const DetailsAPI = require('./details-api.js');
const ReviewsAPI = require('./reviews-api.js');
const RatingsAPI = require('./ratings-api.js');
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  """Each book has a product entry"""
 type Product {
      """Unique identifier for books"""
      id: String
      """The book title"""
      title: String
      """The book description in HTML"""
      descriptionHtml: String
      """The author's name"""
      author: String

      type: String
      """book publisher's name"""
      publisher: String
      """Language the book is written in"""
      language: String
      """Number of pages in the book"""
      pages: Int
      """Year of publication"""
      year: Int
      """Book reviews"""
      reviews: [Reviews]
      """book ratings"""
      ratings: [Ratings]
 }

"""Reviews for the book"""
 type Reviews{
   """Name of the reviewer"""
   reviewer: String
   """Book review"""
   text: String
 }

"""Ratings for the book"""
 type Ratings{
   """Name of the reviewer"""
   reviewer: String
   """Rating by the reviewer"""
   rating: Int
 }

type Query {
  """Detail information for books"""
    productsForHome: [Product]
  }
`;

const resolvers = {
  Query: {
    productsForHome: async (_,__,{dataSources}) => {
      return dataSources.ProductAPI.getProducts();
    }
  },
    Product: {
      author: async (parent, _,{dataSources}) => {
        return (await dataSources.DetailsAPI.getDetails(parent.id)).author;
      },
      type: async (parent, _,{dataSources}) => {
        return (await dataSources.DetailsAPI.getDetails(parent.id)).type;
      },
      publisher: async (parent, _,{dataSources}) => {
        return (await dataSources.DetailsAPI.getDetails(parent.id)).publisher;
      },
      language: async (parent, _,{dataSources}) => {
        return (await dataSources.DetailsAPI.getDetails(parent.id)).language;
      },
      pages: async (parent, _,{dataSources}) => {
        return (await dataSources.DetailsAPI.getDetails(parent.id)).pages;
      },
      year: async (parent, _,{dataSources}) => {
        return (await dataSources.DetailsAPI.getDetails(parent.id)).year;
      },
      reviews: async (parent, _,{dataSources}) => {
        return (dataSources.ReviewsAPI.getReviews(parent.id));
      },
      ratings: async (parent, _,{dataSources}) => {
        return dataSources.RatingsAPI.getRatings(parent.id);
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
      ProductAPI: new ProductAPI(),
      DetailsAPI: new DetailsAPI(),
      ReviewsAPI: new ReviewsAPI(),
      RatingsAPI: new RatingsAPI()
    };
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
