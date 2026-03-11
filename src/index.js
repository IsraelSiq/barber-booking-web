import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App';

const theme = extendTheme({
  config: { initialColorMode: 'dark', useSystemColorMode: false },
  styles: {
    global: {
      body: { bg: 'gray.950', color: 'white' }
    }
  },
  colors: {
    gray: {
      950: '#0a0a0a',
      900: '#111111',
      800: '#1a1a1a',
      700: '#242424',
      600: '#333333',
      500: '#555555',
      400: '#888888',
      300: '#aaaaaa',
    },
    brand: {
      50:  '#fffde7',
      100: '#fff9c4',
      200: '#fff176',
      300: '#ffee58',
      400: '#ffeb3b',
      500: '#ffd600',
      600: '#ffab00',
      700: '#ff8f00',
    }
  },
  components: {
    Button: {
      defaultProps: { colorScheme: 'brand' },
      baseStyle: { fontWeight: 'bold' }
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
