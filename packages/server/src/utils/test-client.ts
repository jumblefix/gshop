import { gql } from 'apollo-server-express';
import Axios from 'axios';
import { print } from 'graphql';
import MutationQueries from './test-mutation-queries';

export default class TestClient extends MutationQueries {
  url: string;
  constructor(url: string) {
    super(url);
    this.url = url;
  }

  async me() {
    return Axios.post(this.url, {
      query: print(gql`
        {
          me {
            id
            name
            email
          }
        }
      `)
    });
  }

  async getCart() {
    return Axios.post(this.url, {
      query: print(gql`
        {
          getCart {
            id
            product {
              id
              title
              price
            }
            user {
              id
              name
              email
            }
          }
        }
      `)
    });
  }

  async listMainCategories() {
    return Axios.post(this.url, {
      query: print(gql`
        {
          listMainCategories {
            id
            name
            slug
          }
        }
      `)
    });
  }

  async getChildCategories(id: string) {
    return Axios.post(this.url, {
      query: print(gql`
        {
          getChildCategories(id: "${id}") {
            id
            name
            slug
            children {
              id
              name
              slug
              children {
                id
                name
                slug
              }
            }
          }
        }
      `)
    });
  }

  async getBreadCrumbPath(id: string) {
    return Axios.post(this.url, {
      query: print(gql`{
        getBreadCrumbPath(id: "${id}") {
          id
          name
          slug
          parent {
            id
            name
            slug
            parent {
              id
              name
              slug
            }
          }
        }
      }`)
    });
  }

  async listProducts() {
    return Axios.post(this.url, {
      query: print(gql`
        {
          listProducts {
            id
            title
            price
            slug
            description
          }
        }
      `)
    });
  }

  async getProduct(id: string) {
    return Axios.post(this.url, {
      query: print(gql`
        {
          getProduct(id: "${id}") {
            id
            title
            price
            slug
            description
          }
        }
      `)
    });
  }

  async getProductByCategory(id: string) {
    return Axios.post(this.url, {
      query: print(gql`
        {
          getProductByCategory(categoryId: "${id}") {
            id
            title
            price
            slug
            description
          }
        }
      `)
    });
  }

  async getUser(id: string) {
    return Axios.post(this.url, {
      query: print(gql`
        {
          getUser(id: "${id}") {
            id
            name
            email
          }
        }
      `)
    });
  }

  async listUsers() {
    return Axios.post(this.url, {
      query: print(gql`
        {
          listUsers {
            id
            name
            email
          }
        }
      `)
    });
  }
}
