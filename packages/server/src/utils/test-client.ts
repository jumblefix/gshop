import { gql } from 'apollo-server-express';
import Axios from 'axios';
import { print } from 'graphql';

export default class TestClient {
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
}

const client = new TestClient('http://localhost:4000/graphql');

client
  .me()
  .then(x => console.log(x.data))
  .catch(e => console.log(e));
