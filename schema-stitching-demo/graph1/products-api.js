const { RESTDataSource } = require('apollo-datasource-rest');

class ProductAPI extends RESTDataSource {
  constructor() {
    // Always call super()
    super();
    // Sets the base URL for the REST API
    this.baseURL = 'http://localhost:30716';
  }

  async getProducts() {
      return this.get(`api/v1/products`);
    }
}

module.exports = ProductAPI
