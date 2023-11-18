import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';

import theme from '@Configs/theme';
import { UserProvider } from '@Modules/Authentication/context/UserContext';

import 'react-datepicker/dist/react-datepicker.css';
import './styles.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        <Head>
          <title>ToNoVermelho</title>
        </Head>
        <Component {...pageProps} />
      </UserProvider>
    </ChakraProvider>
  );
}
export default MyApp;
