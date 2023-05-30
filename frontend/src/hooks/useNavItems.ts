import { useMemo } from 'react';
import { useTrades } from '../contexts/TradesContext';
import { NavLink } from 'react-router-dom';
import {
  CandlestickChart,
  Insights,
  ShoppingCartCheckout,
} from '@mui/icons-material';

export const useNavItems = () => {
  const { trades } = useTrades();

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
        label: `Trades (${trades.length})`,
        value: '/trades',
        to: '/trades',
        component: NavLink,
        icon: ShoppingCartCheckout,
      },
    ],
    [trades]
  );

  return NAV_ITEMS;
};
