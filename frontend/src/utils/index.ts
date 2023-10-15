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

export interface FilledOrder {
  ticker: string;
  date: Date;
  price: number;
  side: string;
}

export const findFilledOrders = (
  orders: Order[],
  ticker: string
): FilledOrder[] => {
  const filtered = orders.filter((order) => order.symbol === ticker);

  const results = [];

  for (let order of filtered) {
    const date = new Date(order.filled_at);
    if (date.getFullYear() === 1970) continue; // Skip orders that are not filled
    const price = order.filled_avg_price;
    const side = order.side;

    results.push({ ticker, date, price, side });

    for (let leg of order.legs) {
      const date = new Date(leg.filled_at);
      if (date.getFullYear() === 1970) continue; // Skip orders that are not filled
      const price = leg.filled_avg_price;
      const side = leg.side;

      results.push({ ticker, date, price, side });
    }
  }

  return results;
};

const testObject = {
  id: 'a2a87e24-3c1b-42b0-9e8f-f64682d8d13c',
  client_order_id: 'z9jUtJAZT4TRum83JjN__',
  created_at: '2023-10-10T18:44:15.544Z',
  updated_at: '2023-10-10T18:44:16.744Z',
  submitted_at: '2023-10-10T18:44:15.550Z',
  filled_at: '2023-10-10T18:44:16.741Z',
  expired_at: '1970-01-01T00:00:00.000Z',
  canceled_at: '1970-01-01T00:00:00.000Z',
  failed_at: '1970-01-01T00:00:00.000Z',
  replaced_at: '1970-01-01T00:00:00.000Z',
  replaced_by: null,
  replaces: null,
  asset_id: '54ec2f34-daa8-4f4c-a572-e53f2ebfcf12',
  symbol: 'HII',
  asset_class: 'us_equity',
  notional: null,
  qty: 25,
  filled_qty: 25,
  filled_avg_price: 218.85,
  order_class: 'bracket',
  order_type: 'market',
  type: 'market',
  side: 'sell',
  time_in_force: 'gtc',
  limit_price: 0,
  stop_price: 0,
  status: 'filled',
  extended_hours: false,
  legs: [
    {
      id: 'dbc5f95c-e789-47e8-87af-b5262b65db70',
      client_order_id: '6f6454a8-de1e-40d7-a825-ddcdd0e57aec',
      created_at: '2023-10-10T18:44:15.544Z',
      updated_at: '2023-10-10T18:44:16.752Z',
      submitted_at: '2023-10-10T18:44:16.750Z',
      filled_at: '1970-01-01T00:00:00.000Z',
      expired_at: '1970-01-01T00:00:00.000Z',
      canceled_at: '1970-01-01T00:00:00.000Z',
      failed_at: '1970-01-01T00:00:00.000Z',
      replaced_at: '1970-01-01T00:00:00.000Z',
      replaced_by: null,
      replaces: null,
      asset_id: '54ec2f34-daa8-4f4c-a572-e53f2ebfcf12',
      symbol: 'HII',
      asset_class: 'us_equity',
      notional: null,
      qty: 25,
      filled_qty: 0,
      filled_avg_price: 0,
      order_class: 'bracket',
      order_type: 'limit',
      type: 'limit',
      side: 'buy',
      time_in_force: 'gtc',
      limit_price: 202.3,
      stop_price: 0,
      status: 'new',
      extended_hours: false,
      legs: [],
      trail_percent: 0,
      trail_price: 0,
      hwm: 0,
      subtag: null,
      source: 'access_key',
    },
    {
      id: '9750122b-1051-4f10-822a-f9bac1a5c523',
      client_order_id: 'deba18ef-3a13-4c6b-84a6-0093af85c1ad',
      created_at: '2023-10-10T18:44:15.544Z',
      updated_at: '2023-10-10T18:44:15.544Z',
      submitted_at: '2023-10-10T18:44:15.542Z',
      filled_at: '1970-01-01T00:00:00.000Z',
      expired_at: '1970-01-01T00:00:00.000Z',
      canceled_at: '1970-01-01T00:00:00.000Z',
      failed_at: '1970-01-01T00:00:00.000Z',
      replaced_at: '1970-01-01T00:00:00.000Z',
      replaced_by: null,
      replaces: null,
      asset_id: '54ec2f34-daa8-4f4c-a572-e53f2ebfcf12',
      symbol: 'HII',
      asset_class: 'us_equity',
      notional: null,
      qty: 25,
      filled_qty: 0,
      filled_avg_price: 0,
      order_class: 'bracket',
      order_type: 'stop_limit',
      type: 'stop_limit',
      side: 'buy',
      time_in_force: 'gtc',
      limit_price: 228.08,
      stop_price: 228.08,
      status: 'held',
      extended_hours: false,
      legs: [],
      trail_percent: 0,
      trail_price: 0,
      hwm: 0,
      subtag: null,
      source: 'access_key',
    },
  ],
  trail_percent: 0,
  trail_price: 0,
  hwm: 0,
  subtag: null,
  source: 'access_key',
};
