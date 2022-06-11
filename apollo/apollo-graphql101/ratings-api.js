
const { RESTDataSource } = require('apollo-datasource-rest');

class RatingssAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:32676';
  }

  async getRatings(id) {
    const result = await this.get(`/ratings/${id}`);
    const ratings = [
      {"reviewer": "Reviewer1", "rating": result.ratings.Reviewer1},
      {"reviewer": "Reviewer2", "rating": result.ratings.Reviewer2}
    ];
   return ratings;
  }
}

module.exports = RatingssAPI
