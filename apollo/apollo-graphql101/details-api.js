
const { RESTDataSource } = require('apollo-datasource-rest');

class DetailsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:31972';
  }

  async getDetails(id) {
      return this.get(`/details/${id}`);
    }
}

module.exports = DetailsAPI
