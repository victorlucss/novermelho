import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: { red: { 500: '#FF1033', 700: '#93002A' }, gray: { 100: '#f8f9fa' } },
  styles: {
    global: {
      'html, body': {
        background: 'gray.100',
      },
    },
  },
});

export default theme;
