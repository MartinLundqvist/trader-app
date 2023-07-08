import { useMemo } from 'react';
import { useTrades } from '../contexts/TradesContext';
import { NavLink } from 'react-router-dom';
import {
  BusinessCenter,
  CandlestickChart,
  Checklist,
  Insights,
  ListAlt,
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
        label: `New trades (${nrTrades})`,
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
      {
        label: `Placed trades`,
        value: '/placedtrades',
        to: '/placedtrades',
        component: NavLink,
        icon: ListAlt,
      },
      {
        label: `Positions`,
        value: '/positions',
        to: '/positions',
        component: NavLink,
        icon: BusinessCenter,
      },
    ],
    [nrTrades, nrJobs]
  );

  return NAV_ITEMS;
};
