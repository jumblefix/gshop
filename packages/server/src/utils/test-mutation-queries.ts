import { gql } from 'apollo-server-express';
import Axios from 'axios';
import { print } from 'graphql';

export default class MutationQueries {
  url: string;
  testing: boolean;
  constructor(url: string, testing: boolean) {
    this.url = url;
    this.testing = testing;
  }

  returnQueryOrPromise(query: any) {
    if (this.testing) {
      return query;
    }
    return Axios.post(this.url, { query });
  }

  async register(name: string, email: string, password: string) {
    const query = print(gql`
        mutation {
          register(name: "${name}", email: "${email}", password: "${password}") {
            id
            name
            email
          }
        }
      `);
    return this.returnQueryOrPromise(query);
  }

  async addToCart(productId: string, quantity: number = 1) {
    const query = print(gql`
        mutation {
          addToCart(productId: "${productId}", quantity: ${quantity}) {
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

  async removeFromCart(productId: string) {
    const query = print(gql`
        mutation {
          removeFromCart(productId:"${productId}")
        }
      `);
    return this.returnQueryOrPromise(query);
  }

  async emptyCart() {
    const query = print(gql`
      mutation {
        emptyCart
      }
    `);
    return this.returnQueryOrPromise(query);
  }

  async addCategory(name: string, parent: string) {
    const query = print(gql`
        mutation {
          addCategory(name: "${name}", parentId: "${parent}") {
            id
            name
            slug
          }
        }
      `);
    return this.returnQueryOrPromise(query);
  }

  async addProduct(
    title: string,
    coverImage: string,
    description: string,
    rating: number,
    price: number,
    offerPrice: string,
    categoryId: string
  ) {
    const query = print(gql`
        mutation {
          addProduct(
            title: "${title}"
            coverImage:  "${coverImage}"
            description:  "${description}"
            rating: ${rating}
            price: ${price}
            offerPrice: ${offerPrice}
            categoryId: "${categoryId}"
          ) {
            id
            title
            slug
            price
            description
          }
        }
      `);
    return this.returnQueryOrPromise(query);
  }

  async login(email: string, password: string) {
    const query = print(gql`
        mutation {
          login(email: "${email}", password: "${password}") {
            id
            name
            email
          }
        }
      `);
    return this.returnQueryOrPromise(query);
  }

  async logout() {
    const query = print(gql`
      mutation {
        logout
      }
    `);
    return this.returnQueryOrPromise(query);
  }

  async resendVerifySignup() {
    const query = print(gql`
      mutation {
        resendVerifySignup
      }
    `);
    return this.returnQueryOrPromise(query);
  }

  async sendResetPassword(email: string) {
    const query = print(gql`
        mutation {
          sendResetPassword(email:"${email}")
        }
      `);
    return this.returnQueryOrPromise(query);
  }

  async verifyResetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ) {
    const query = print(gql`
        mutation {
          verifyResetPassword(token:"${token}",password:"${password}",confirmPassword:"${confirmPassword}"){
            id
            name
            email
          }
        }
      `);
    return this.returnQueryOrPromise(query);
  }

  async changePassword(oldPassword: string, password: string) {
    const query = print(gql`
        mutation {
          changePassword(oldPassword:"${oldPassword}",password:"${password}"){
            id
            name
            email
          }
        }
      `);
    return this.returnQueryOrPromise(query);
  }

  async changeEmail(email: string) {
    const query = print(gql`
        mutation {
          changeEmail(email:"${email}"){
            id
            name
            email
          }
        }
      `);
    return this.returnQueryOrPromise(query);
  }
}
