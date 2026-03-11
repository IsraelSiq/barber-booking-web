import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App';

const theme = extendTheme({
  config: { initialColorMode: 'dark', useSystemColorMode: false },
  styles: {
    global: {
      body: { bg: 'gray.900', color: 'white' }
    }
  },
  colors: {
    brand: {
      500: '#e94560',
      600: '#c73652',
    }
  },
  components: {
    Button: {
      defaultProps: { colorScheme: 'brand' }
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
