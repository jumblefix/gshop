import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'reakit';
import theme from 'reakit-theme-default';

export default class MyApp extends App {
  static async getInitialProps({ Component, _, ctx }: any) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Provider theme={theme}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}
