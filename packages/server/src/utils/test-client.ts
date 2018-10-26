import { gql } from 'apollo-server-express';
import { print } from 'graphql';
import MutationQueries from './test-mutation-queries';

export default class TestClient extends MutationQueries {
  url: string;
  testing: boolean;
  constructor(url: string, testing: boolean = false) {
    super(url, testing);
    this.url = url;
    this.testing = testing;
  }

  async me() {
    const query = print(gql`
      {
        me {
          id
          name
          email
        }
      }
    `);
    return this.returnQueryOrPromise(query);
  }

  async getCart() {
    const query = print(gql`
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
    `);
    return this.returnQueryOrPromise(query);
  }

  async listMainCategories() {
    const query = print(gql`
      {
        listMainCategories {
          id
          name
          slug
        }
      }
    `);

    return this.returnQueryOrPromise(query);
  }

  async getChildCategories(id: string) {
    const query = print(gql`
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
      `);
    return this.returnQueryOrPromise(query);
  }

  async getBreadCrumbPath(id: string) {
    const query = print(gql`{
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
      }`);
    return this.returnQueryOrPromise(query);
  }

  async listProducts() {
    const query = print(gql`
      {
        listProducts {
          id
          title
          price
          slug
          description
        }
      }
    `);
    return this.returnQueryOrPromise(query);
  }

  async getProduct(id: string) {
    const query = print(gql`
        {
          getProduct(id: "${id}") {
            id
            title
            price
            slug
            description
          }
        }
      `);
    return this.returnQueryOrPromise(query);
  }

  async getProductByCategory(id: string) {
    const query = print(gql`
        {
          getProductByCategory(categoryId: "${id}") {
            id
            title
            price
            slug
            description
          }
        }
      `);
    return this.returnQueryOrPromise(query);
  }

  async getUser(id: string) {
    const query = print(gql`
        {
          getUser(id: "${id}") {
            id
            name
            email
          }
        }
      `);
    return this.returnQueryOrPromise(query);
  }

  async listUsers() {
    const query = print(gql`
      {
        listUsers {
          id
          name
          email
        }
      }
    `);
    return this.returnQueryOrPromise(query);
  }
}
