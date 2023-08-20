import { Order, PlacedTrades, Trade } from '@trader/types';
import { PlacedTradeJob } from '../hooks/usePlacedTradeJobs';

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

export const getPositionSize = (trade: Trade) => {
  if (trade.side === 'buy') return trade.limit * trade.qty;

  return 0;
};

export const createPlacedTradeJobs = (
  placedTrades: PlacedTrades
): PlacedTradeJob[] => {
  const jobs: PlacedTradeJob[] = [];

  placedTrades.forEach((trade) => {
    const job = jobs.find((j) => j.job_id === trade.job_id);

    if (!job) {
      jobs.push({
        job_id: trade.job_id,
        placed_at: trade.placed_at,
        nrTrades: 1,
        nrSuccessful: trade.status === 'successful' ? 1 : 0,
        nrFailed: trade.status === 'failed' ? 1 : 0,
        trades: [trade],
      });
    } else {
      job.nrTrades += 1;
      if (trade.status === 'successful') job.nrSuccessful += 1;
      if (trade.status === 'failed') job.nrFailed += 1;

      job.trades.push(trade);
    }
  });

  return jobs;
};

export const positionStatus = (order: Order): 'open' | 'closed' => {
  if (order.status !== 'filled') return 'open';

  const originalQty = order.qty;
  const legs = order.legs;

  const filledQty = legs.reduce((acc, leg) => {
    return leg.status === 'filled' ? acc + leg.qty : acc;
  }, 0);

  return originalQty === filledQty ? 'closed' : 'open';
};

export const positionPnL = (order: Order) => {
  if (positionStatus(order) === 'open') return undefined;
  const acquisitionCost = order.qty * order.filled_avg_price;

  // If there is a leg with a status of 'filled', then we can calculate the PnL
  const filledLeg = order.legs.find((leg) => leg.status === 'filled');

  if (!filledLeg) return undefined;

  const filledCost = filledLeg.qty * filledLeg.filled_avg_price;

  return {
    absolute: (filledCost - acquisitionCost).toFixed(2),
    percent: ((100 * (filledCost - acquisitionCost)) / acquisitionCost).toFixed(
      2
    ),
  };
};

export const nrProfitableOrders = (orders: Order[]) => {
  return orders.filter((order) => {
    const pnl = positionPnL(order);
    if (!pnl) return false;

    return Number(pnl.absolute) > 0;
  }).length;
};

export const totalAquisitionCost = (orders: Order[]) => {
  return orders.reduce((acc, order) => {
    const acquisitionCost = order.qty * order.filled_avg_price;

    return acc + acquisitionCost;
  }, 0);
};

export const totalProfit = (orders: Order[]) => {
  return orders.reduce((acc, order) => {
    const pnl = positionPnL(order);
    if (!pnl) return acc;

    return acc + Number(pnl.absolute);
  }, 0);
};
