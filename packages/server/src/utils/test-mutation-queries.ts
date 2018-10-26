import { gql } from 'apollo-server-express';
import Axios from 'axios';
import { print } from 'graphql';

export default class MutationQueries {
  url: string;
  constructor(url: string) {
    this.url = url;
  }

  async register(name: string, email: string, password: string) {
    return Axios.post(this.url, {
      query: print(gql`
        mutation {
          register(name: "${name}", email: "${email}", password: "${password}") {
            id
            name
            email
          }
        }
      `)
    });
  }

  async addToCart(productId: string, quantity: number = 1) {
    return Axios.post(this.url, {
      query: print(gql`
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
      `)
    });
  }

  async removeFromCart(productId: string) {
    return Axios.post(this.url, {
      query: print(gql`
        mutation {
          removeFromCart(productId:"${productId}")
        }
      `)
    });
  }

  async emptyCart() {
    return Axios.post(this.url, {
      query: print(gql`
        mutation {
          emptyCart
        }
      `)
    });
  }

  async addCategory(name: string, parent: string) {
    return Axios.post(this.url, {
      query: print(gql`
        mutation {
          addCategory(name: "${name}", parentId: "${parent}") {
            id
            name
            slug
          }
        }
      `)
    });
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
    return Axios.post(this.url, {
      query: print(gql`
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
      `)
    });
  }

  async login(email: string, password: string) {
    return Axios.post(this.url, {
      query: print(gql`
        mutation {
          login(email: "${email}", password: "${password}") {
            id
            name
            email
          }
        }
      `)
    });
  }

  async logout() {
    return Axios.post(this.url, {
      query: print(gql`
        mutation {
          logout
        }
      `)
    });
  }

  async resendVerifySignup() {
    return Axios.post(this.url, {
      query: print(gql`
        mutation {
          resendVerifySignup
        }
      `)
    });
  }

  async sendResetPassword(email: string) {
    return Axios.post(this.url, {
      query: print(gql`
        mutation {
          sendResetPassword(email:"${email}")
        }
      `)
    });
  }

  async verifyResetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ) {
    return Axios.post(this.url, {
      query: print(gql`
        mutation {
          verifyResetPassword(token:"${token}",password:"${password}",confirmPassword:"${confirmPassword}"){
            id
            name
            email
          }
        }
      `)
    });
  }

  async changePassword(oldPassword: string, password: string) {
    return Axios.post(this.url, {
      query: print(gql`
        mutation {
          changePassword(oldPassword:"${oldPassword}",password:"${password}"){
            id
            name
            email
          }
        }
      `)
    });
  }

  async changeEmail(email: string) {
    return Axios.post(this.url, {
      query: print(gql`
        mutation {
          changeEmail(email:"${email}"){
            id
            name
            email
          }
        }
      `)
    });
  }
}
