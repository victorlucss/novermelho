import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import theme from '@Configs/theme';
import { UserProvider } from '@Modules/Authentication/context/UserContext';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ChakraProvider>
  );
}
export default MyApp;
