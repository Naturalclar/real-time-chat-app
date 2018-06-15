import * as React from 'react';
import Head from 'next/head';

export interface Props {
  pageTitle: string,
  children?: any
}

const Layout = (props:Props) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1, shrink-to-fit=no" />
      <link 
        rel="stylesheet" 
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" 
        integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" 
        crossOrigin="anonymous" 
      />
      <title>{props.pageTitle || 'Realtime Chat'}</title>
    </Head>
    {props.children}
  </>
)

export default Layout;