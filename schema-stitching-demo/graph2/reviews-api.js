
const { RESTDataSource } = require('apollo-datasource-rest');

class ReviewsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:31066';
  }

  async getReviews(id) {
    const data =  await this.get(`/reviews/${id}`);
    return data.reviews;
  }
}

module.exports = ReviewsAPI
