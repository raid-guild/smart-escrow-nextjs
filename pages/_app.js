import { ChakraProvider } from '@chakra-ui/provider';
import { Global } from '@emotion/react';
import Router from 'next/router';
import nProgress from 'nprogress';
import { Layout } from '../shared/Layout';
import AppContextProvider from '../context/AppContext';
import { theme, globalStyles } from '../theme/theme';

import '../styles/globals.css';
import '../nprogress.css';
import '../index.css';

Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', () => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Global styles={globalStyles} />
      <AppContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
