import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TradesProvider } from './contexts/TradesContext';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Strategies from './pages/Strategies';
import Signals from './pages/Signals';
import Trades from './pages/Trades';
import Strategy from './components/Strategy';
import Jobs from './pages/Jobs';
import PlacedTrades from './pages/PlacedTrades';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const theme = createTheme({
  typography: {
    fontSize: 12,
  },
  palette: {
    background: {
      default: '#f5f5f5e5',
    },
  },
});

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Strategies /> },
      {
        path: 'strategies',
        element: <Strategies />,
      },
      {
        path: 'signals',
        element: <Signals />,
        children: [
          {
            path: ':strategy',
            element: <Strategy />,
          },
          {
            path: ':strategy/:ticker',
            element: <Strategy />,
          },
        ],
      },
      {
        path: 'trades',
        element: <Trades />,
      },
      {
        path: 'jobs',
        element: <Jobs />,
      },
      {
        path: 'placedtrades',
        element: <PlacedTrades />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <TradesProvider>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </TradesProvider>
    </ThemeProvider>
  </React.StrictMode>
);
