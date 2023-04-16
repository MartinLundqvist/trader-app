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
import { Announcement } from './broker_provider/alpaca/entities.js';

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

  await writeFile(`strategies.json`, JSON.stringify(results));

  return results;
};

const refreshMarketData = async () => {
  const lastestDate = await MarketDataDB.getLatestDate();
  const oneDayOffset = 1000 * 60 * 60 * 24;
  const fromDate = new Date(lastestDate.getTime() + oneDayOffset);
  const toDate = new Date();

  const tickers = await TickerDB.findAllTickers();

  const data = await MarketDataProvider.getMultipleEODDataFromTo(
    tickers,
    fromDate,
    toDate
  );

  // For testing, write data to a file
  // await writeFile(
  //   `marketdata_test_${toDate.toISOString()}.json`,
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
    // The limit here is redundant
    let { side, limit } = parseSignal(trade);

    console.log(side, limit);
    if (!side || !limit) continue;

    let stop_loss = 0;
    let take_profit = 0;
    let latest_trade = await Trader.getLastTrade_v2({
      symbol: trade[0].symbol,
    });

    console.log(latest_trade.trade.p);

    if (side === 'buy') {
      stop_loss = Number((latest_trade.trade.p * 0.97).toFixed(2));
      take_profit = Number((latest_trade.trade.p * 1.1).toFixed(2));
    }
    if (side === 'sell') {
      stop_loss = Number((latest_trade.trade.p * 1.03).toFixed(2));
      take_profit = Number((latest_trade.trade.p * 0.9).toFixed(2));
    }

    const order = {
      symbol: trade[0].symbol,
      side: side,
      qty: Math.ceil(position_size / limit),
      type: 'market',
      time_in_force: 'gtc',
      order_class: 'bracket',
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
        time_in_force: 'gtc',
        order_class: 'bracket',
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

const getOrders = async () => {
  const orders = await Trader.getOrders({ status: 'closed' });
  console.log(orders);
};

const readStrategies = async () => {
  const file = await readFile('strategies.json', 'utf8');
  const data = JSON.parse(file);
  return data as StrategyResponse[];
};

const TEST_ReadMarketDataFromAlpavantage = async () => {
  const tickers = await TickerDB.findAllTickers();
  const lastestDate = await MarketDataDB.getLatestDate();
  const oneDayOffset = 1000 * 60 * 60 * 24;
  const fromDate = new Date(lastestDate.getTime() + oneDayOffset);
  const toDate = new Date(Date.now() - 60 * 60 * 1000);

  try {
    const bars = await Trader.getMultiBars({
      // symbols: tickers.slice(0, 100),
      symbols: tickers,
      timeframe: '1Day',
      limit: 10_000,
      start: fromDate,
      end: toDate,
    });

    await writeFile('bars.json', JSON.stringify(bars));
  } catch (err) {
    console.log(err);
  }
};

// runModel();

const getCorporateActions = async () => {
  try {
    const cas = await Trader.getAnnouncements({
      ca_types: ['dividend', 'merger', 'spinoff', 'split'],
      since: new Date('2023-01-01'),
      until: new Date('2023-03-01'),
    });

    console.log(cas[0]);
    console.log(cas[1]);
    console.log(cas[2]);
    console.log(cas[3]);

    await writeFile('cas.json', JSON.stringify(cas));
  } catch (err) {
    console.log(err);
  }
};

const CA_tests = async () => {
  const cas = JSON.parse(await readFile('cas.json', 'utf-8')) as Announcement[];

  const searchFor = [
    'AAPL',
    'AMZN',
    'BRK-B',
    'GOOG',
    'JNJ',
    'META',
    'MSFT',
    'NVDA',
    'TSLA',
    'V',
  ];

  const filtered = cas.filter((a) => searchFor.includes(a.initiating_symbol));

  await writeFile('cas_filtered.json', JSON.stringify(filtered));

  console.log(filtered);
};

// CA_tests();
// refreshMarketData();
// runModel();
// const trades = await readStrategies();
// placeTrades(trades, 0.25);
// getOrders();
// console.log(account);
// const account = await Trader.getAccountConfigurations();
