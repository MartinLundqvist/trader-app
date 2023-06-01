import { useMemo } from 'react';
import { useTrades } from '../contexts/TradesContext';
import { NavLink } from 'react-router-dom';
import {
  CandlestickChart,
  Checklist,
  Insights,
  ShoppingCartCheckout,
} from '@mui/icons-material';
import { useJobs } from './useJobs';

export const useNavItems = () => {
  const { trades } = useTrades();
  const { jobs } = useJobs();

  const nrJobs = jobs ? jobs.pending.length : 0;
  const nrTrades = trades ? trades.length : 0;

  const NAV_ITEMS = useMemo(
    () => [
      {
        label: 'Strategies',
        value: '/strategies',
        to: '/strategies',
        component: NavLink,
        icon: Insights,
      },
      {
        label: 'Signals',
        value: '/signals',
        to: '/signals',
        component: NavLink,
        icon: CandlestickChart,
      },
      {
        label: `Trades (${nrTrades})`,
        value: '/trades',
        to: '/trades',
        component: NavLink,
        icon: ShoppingCartCheckout,
      },
      {
        label: `Background jobs (${nrJobs})`,
        value: '/jobs',
        to: '/jobs',
        component: NavLink,
        icon: Checklist,
      },
    ],
    [nrTrades, nrJobs]
  );

  return NAV_ITEMS;
};
