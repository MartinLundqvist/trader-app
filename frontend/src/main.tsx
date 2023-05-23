import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TraderProvider from './contexts/TraderContext';
import { TradesProvider } from './contexts/TradesContext';

const theme = createTheme({
  typography: {
    fontSize: 12,
  },
});
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <TradesProvider>
        <TraderProvider>
          <QueryClientProvider client={queryClient}>
            <CssBaseline />
            <App />
          </QueryClientProvider>
        </TraderProvider>
      </TradesProvider>
    </ThemeProvider>
  </React.StrictMode>
);
