import { Trade } from '@trader/types';

export const getDaysDifference = (date1: Date, date2: Date) => {
  // Get the difference in milliseconds
  const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());

  // Convert milliseconds to days (1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  return diffInDays;
};

export const getMaintenanceMargin = (trade: Trade): number => {
  let position = trade.limit * trade.qty;

  if (trade.side === 'buy') {
    if (trade.limit < 2.5) return position;
    return position * 0.3;
  }

  if (trade.side === 'sell') {
    if (trade.limit < 5) {
      if (trade.qty * 2.5 > position) {
        return trade.qty * 2.5;
      } else {
        return position;
      }
    } else {
      if (trade.qty * 5 > 0.3 * position) {
        return trade.qty * 5;
      } else {
        return position;
      }
    }
  }

  return 0;
};
