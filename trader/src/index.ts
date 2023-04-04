// Load the latest market data for all symbols in the database

import { readFile, writeFile } from 'fs/promises';
import TickerDB from './database_provider/model_tickers.js';
import { getSignal } from './position_computer/index.js';
import { StrategyResponse } from './types/index.js';
import MarketDataDB from './database_provider/model_marketdata.js';
import MarketDataProvider from './market_data_provider/tiingo/index.js';
import Trader from './broker_provider/index.js';
import { parseSignal } from './utils/index.js';
import { strategyResponseSchema } from './schemas/index.js';

// Throw the data at the strategies and collect signals
const runModel = async (): Promise<StrategyResponse[]> => {
  const tickers = await TickerDB.findAllTickers();
  const slicedTickers = tickers;
  let results: StrategyResponse[] = [];

  for (let ticker of slicedTickers) {
    let data = await getSignal(ticker);

    if (!data) {
      console.log('No data received:', ticker);
      continue;
    }

    if (data.some((d) => d.signal)) results.push(data);
  }

  console.log(
    `Tested ${slicedTickers.length} tickers and found ${results.length} signals.`
  );

  await writeFile('results.json', JSON.stringify(results));

  return results;
};

const refreshMarketData = async () => {
  const lastestDate = await MarketDataDB.getLatestDate();
  const oneDayOffset = 1000 * 60 * 60 * 24;
  const fromDate = new Date(lastestDate.getTime() + oneDayOffset);
  const toDate = new Date();
  const tickers = await TickerDB.findAllTickers();

  const data = await MarketDataProvider.getEODDataFromTo(
    tickers,
    fromDate,
    toDate
  );

  // For testing, write data to a file
  // await writeFile(
  //   `marketdata_${toDate.toISOString()}.json`,
  //   JSON.stringify(data)
  // );

  await MarketDataDB.createData(data);
};

const placeTrades = async (
  trades: StrategyResponse[],
  share_of_wallet: number
): Promise<any> => {
  const account = await Trader.getAccount();
  const cash = account.cash;
  const position_size = (cash * share_of_wallet) / trades.length;
  const attemptedOrders: any = [];
  const completedOrders: any = [];
  const failedOrders: any = [];

  for (let trade of trades) {
    const { side, limit } = parseSignal(trade);

    console.log(side, limit);
    if (!side || !limit) continue;

    let stop_loss = 0;
    let take_profit = 0;

    if (side === 'buy') {
      stop_loss = limit * 0.97;
      take_profit = limit * 1.1;
    }
    if (side === 'sell') {
      stop_loss = limit * 1.03;
      take_profit = limit * 0.9;
    }

    const order = {
      symbol: trade[0].symbol,
      side: side,
      qty: Math.ceil(position_size / limit),
      type: 'market',
      time_in_force: 'day',
      stop_loss: {
        stop_price: stop_loss,
      },
      take_profit: {
        limit_price: take_profit,
      },
    };

    console.log('Placing order:', order);
    attemptedOrders.push(order);

    try {
      await Trader.placeOrder({
        symbol: trade[0].symbol,
        side: side,
        qty: Math.ceil(position_size / limit),
        type: 'market',
        time_in_force: 'day',
        stop_loss: {
          stop_price: stop_loss,
        },
        take_profit: {
          limit_price: take_profit,
        },
      });
      completedOrders.push(order);
    } catch (err) {
      console.log('Error placing order');
      console.log(err);
      failedOrders.push(order);
    }
  }

  await writeFile('attempted_orders.json', JSON.stringify(attemptedOrders));
  await writeFile('completed_orders.json', JSON.stringify(completedOrders));
  await writeFile('failed_orders.json', JSON.stringify(failedOrders));
};

const readStrategies = async () => {
  const file = await readFile('test_strategies.json', 'utf8');
  const data = JSON.parse(file);
  return data as StrategyResponse[];
};

// runModel();

// refreshMarketData();
// runModel();
// const trades = await readStrategies();
// const account = await Trader.getAccountConfigurations();
// console.log(account);
// placeTrades(trades, 0.5);
