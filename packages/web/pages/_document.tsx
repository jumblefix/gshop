import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';

const config = {
  SITE_NAME: 'My Website',
  SITE_TITLE: 'My Website',
  SITE_DESCRIPTION: 'My Website description',
  SITE_IMAGE: ''
};

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
          />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={config.SITE_NAME} />
          <meta property="og:title" content={config.SITE_TITLE} />
          <meta property="og:description" content={config.SITE_DESCRIPTION} />
          <meta property="og:image" content={config.SITE_IMAGE} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content={config.SITE_NAME} />
          <meta name="twitter:title" content={config.SITE_TITLE} />
          <meta name="twitter:description" content={config.SITE_DESCRIPTION} />
          <meta property="twitter:image" content={config.SITE_IMAGE} />
          <meta
            name="format-detection"
            content="telephone=no, address=no, email=no"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
