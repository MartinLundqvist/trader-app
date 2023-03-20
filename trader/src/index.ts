// import MDP from './market_data_provider/marketstack/index.js';
import MDP from './market_data_provider/tiingo/index.js';
import { writeFile } from 'fs/promises';
import { getBacktest, getSignal } from './position_computer/index.js';
import { tickers } from './constants/100tickers.js';
import fs from 'fs/promises';
import { MarketData, Tickers } from './types/index.js';
import json from './development_assets/100tickers12months.json' assert { type: 'json' };
import {
  marketDataSchema,
  tickerSchema,
  tickersSchema,
} from './schemas/index.js';
import { connectToDB, synchronizeDB } from './database_provider/index.js';
import MarketDataDB from './database_provider/model_marketdata.js';
import TickerDB from './database_provider/model_tickers.js';

interface Signal {
  date: string;
  symbol: string;
  signal: string;
  limit: number;
  close: number;
  strength: number;
}

interface Position {
  symbol: string;
  quantity: number;
  entry_price: number;
  entry_cost: number;
  entry_date: string;
  exit_price: number;
  exit_date: string;
  exit_proceeds: number;
  gain: number;
  open: boolean;
}

const runModel = async () => {
  const tickers = await TickerDB.findAllTickers();
  const slicedTickers = tickers.slice(0, 250);
  let results: Signal[] = [];

  for (let ticker of slicedTickers) {
    let data = (await getSignal(ticker)) as Signal[];
    results.push(...data);
  }

  results.sort((a, b) => b.strength - a.strength);

  await writeFile('results.json', JSON.stringify(results));
};

const runOneBacktest = async () => {
  const tickers = await TickerDB.findAllTickers();
  const slicedTickers = tickers.slice(0, 500);
  const positions: Position[] = [];
  const investment = 10_000;
  // const trades: Signal[] = [];

  for (let ticker of slicedTickers) {
    let data = (await getBacktest(ticker)) as Signal[];
    let length = data.length;
    // This simulates the daily operation of the model
    for (let i = 0; i < length; i++) {
      // If there is a signal, we want to process it against or current positions
      if (data[i].signal) {
        // Do we have an open position in this stock?
        const position = positions.find(
          (position) =>
            position.symbol === data[i].symbol && position.open === true
        );

        // If we have a position and it is a 'sell' signal, we want to close the position
        if (position && data[i].signal === 'sell') {
          // Calculate the proceeds
          position.exit_proceeds = data[i].close * position.quantity;
          position.exit_date = data[i].date;
          position.exit_price = data[i].close;
          position.gain =
            (position.exit_proceeds - position.entry_cost) /
            position.entry_cost;
          position.open = false;
          continue;
        }

        // If we do not have an open position and it is a buy signal, we buy it
        if (!position && data[i].signal === 'buy') {
          positions.push({
            symbol: data[i].symbol,
            quantity: Math.floor(investment / data[i].close),
            entry_price: data[i].close,
            entry_cost: investment,
            entry_date: data[i].date,
            exit_price: 0,
            exit_date: '',
            exit_proceeds: 0,
            gain: 0,
            open: true,
          });
        }
      }
    }
    // results.push(...data);
  }
  await writeFile('backtest.json', JSON.stringify(positions));

  // Calculate some statistics

  const openPositions = positions.filter((position) => position.open === true);
  const closedPositions = positions.filter(
    (position) => position.open === false
  );

  let totalInvestment = closedPositions.reduce((acc, curr) => {
    return acc + curr.entry_cost;
  }, 0);
  let totalProceeds = closedPositions.reduce((acc, curr) => {
    return acc + curr.exit_proceeds;
  }, 0);

  console.log(`Open Positions: ${openPositions.length}`);
  console.log(`Closed Positions: ${closedPositions.length}`);
  console.log(`Total Investment: ${totalInvestment}`);
  console.log(`Total Proceeds: ${totalProceeds}`);
  console.log(`Total Gain: ${totalProceeds - totalInvestment}`);
  console.log(
    `Total Gain %: ${(totalProceeds - totalInvestment) / totalInvestment}`
  );
  console.log(
    `Number of positions with a gain: ${
      closedPositions.filter((position) => position.gain > 0).length
    }`
  );
  console.log(
    `Number of positions with a loss: ${
      closedPositions.filter((position) => position.gain < 0).length
    }`
  );
  console.log(
    `Best performing position: ${Math.max(
      ...closedPositions.map((position) => position.gain)
    )}`
  );
  console.log(
    `Worst performing position: ${Math.min(
      ...closedPositions.map((position) => position.gain)
    )}`
  );
};

const getTickerData = async () => {
  const first10 = tickers.slice(0, 10);

  const data = await MDP.getEODDataFromTo(
    tickers,
    new Date('2022-02-01'),
    new Date('2023-02-28')
  );

  await writeFile('first1012Months.json', JSON.stringify(data));
};

const test = async () => {
  const data = await MDP.getEODDataFromTo(
    ['TSLA'],
    new Date('2022-08-20'),
    new Date('2022-08-30')
  );

  await writeFile('tsla_Splits.json', JSON.stringify(data));
};

// const parse100Tickers = async (): Promise<string[]> => {
//   const file = await fs.readFile(
//     './src/market_data_provider/marketstack/XNAS.json',
//     'utf-8'
//   );

//   const json = JSON.parse(file);

//   // console.log(json);

//   let results: string[] = [];
//   let i = 0;

//   while (results.length < 100) {
//     results.push(json.data.tickers[i].symbol);
//     i++;
//   }

//   return results;
// };

const getManyTickersData = async () => {
  const data = await MDP.getEODDataFromTo(
    tickers,
    new Date('2022-02-01'),
    new Date('2023-02-28')
  );

  await writeFile('100tickers.json', JSON.stringify(data));
};

const readAndParseMarketData = async () => {
  const file = await fs.readFile(
    './src/development_assets/100tickers12months.json',
    'utf-8'
  );

  // const json: MarketData = JSON.parse(file);

  let nrEntries = 0;
  const tickers = new Map<string, number>();

  const marketdata = marketDataSchema.parse(json);

  return marketdata;

  // for (const entry of marketdata) {
  //   nrEntries++;
  //   if (tickers.has(entry.symbol)) {
  //     let value = tickers.get(entry.symbol);
  //     tickers.set(entry.symbol, value! + 1);
  //   } else {
  //     tickers.set(entry.symbol, 0);
  //   }
  // }

  // console.log(tickers.size);
  // console.log(tickers);
};
const readAndParseTickerData = async () => {
  const file = await fs.readFile(
    './src/development_assets/supported_tickers.csv',
    'utf-8'
  );

  let tickers: Tickers = [];

  const rows = file.split(`\n`);

  // const length = 10;
  const length = rows.length;

  for (let i = 1; i < length; i++) {
    const entries = rows[i].split(',');
    // console.log(entries);
    const symbol = entries[0];
    const exchange = entries[1];
    const asset_type = entries[2];
    const price_currency = entries[3];
    const start_date = entries[4] || null;
    const end_date = entries[5] || null;
    // console.log(symbol);

    try {
      const entry = tickerSchema.parse({
        symbol,
        exchange,
        asset_type,
        price_currency,
        start_date,
        end_date,
      });

      tickers.push(entry);
    } catch (error) {
      console.log('Error, skipping a row');
    }
  }

  return tickers;

  // let nrEntries = 0;
  // const tickers = new Map<string, number>();

  // const marketdata = marketDataSchema.parse(json);

  // return marketdata;

  // for (const entry of marketdata) {
  //   nrEntries++;
  //   if (tickers.has(entry.symbol)) {
  //     let value = tickers.get(entry.symbol);
  //     tickers.set(entry.symbol, value! + 1);
  //   } else {
  //     tickers.set(entry.symbol, 0);
  //   }
  // }

  // console.log(tickers.size);
  // console.log(tickers);
};

const seedDataBase = async () => {
  await connectToDB();

  await synchronizeDB();

  const marketdata = await readAndParseMarketData();
  await MarketDataDB.createData(marketdata);

  const tickerdata = await readAndParseTickerData();
  await TickerDB.createData(tickerdata);
};

const testDataBase = async () => {
  await connectToDB();

  const tickers = await TickerDB.findTickersFrom(['NASDAQ'], ['Stock']);

  console.log(tickers.length);

  const marketdata = await MarketDataDB.readData(
    ['MSFT'],
    new Date('2022-06-01'),
    new Date('2022-06-10')
  );

  console.log(marketdata);

  // const test = await TickerDB.getExchanges();

  // console.log(test);
};

const readAndParseMarketCapData = async () => {
  let results: any[] = [];
  let fails: any[] = [];
  let missing: any[] = [];

  const file = await fs.readFile(
    './src/development_assets/marketcap.csv',
    'utf-8'
  );
  const rows = file.split(`\n`);

  // const length = 10;
  const length = rows.length;

  for (let i = 1; i < length; i++) {
    const entries = rows[i].split(',');
    const name = entries[1].substring(1, entries[1].length - 1);
    const symbol = entries[2].substring(1, entries[2].length - 1);
    const market_cap = entries[3].substring(1, entries[3].length - 1);

    let exchange = '';
    let asset_type = '';
    let price_currency = '';
    let start_date = null;
    let end_date = null;

    let ticker_data = await TickerDB.findDataByTickers([symbol]);

    if (ticker_data.length === 1) {
      // Nice - we have one unique match
      exchange = ticker_data[0].exchange || '';
      asset_type = ticker_data[0].asset_type || '';
      price_currency = ticker_data[0].price_currency || '';
      start_date = ticker_data[0].start_date || null;
      end_date = ticker_data[0].end_date || null;

      // try {
      //   const entry = tickerSchema.parse({
      //     symbol,
      //     exchange,
      //     asset_type,
      //     price_currency,
      //     start_date,
      //     end_date,
      //   });

      //   tickers.push(entry);
      // } catch (error) {
      //   console.log('Error, skipping a row');
      // }
    } else if (ticker_data.length > 1) {
      // We got duplicates - let's see if there is one useful
      let filtered = ticker_data.filter((entry) => {
        return entry.end_date?.getTime() === new Date('2023-03-16').getTime();
      });

      // if (symbol === 'ZIP') {
      //   console.log(ticker_data);
      //   console.log(filtered);
      //   console.log(new Date('2023-03-16'));
      //   throw new Error('ZIP found');
      // }
      if (filtered.length === 1) {
        exchange = filtered[0].exchange || '';
        asset_type = filtered[0].asset_type || '';
        price_currency = filtered[0].price_currency || '';
        start_date = filtered[0].start_date || null;
        end_date = filtered[0].end_date || null;
      } else {
        // No useful data - fail it
        fails.push(symbol);
        continue;
      }
    } else {
      // No data - it is missing
      missing.push(symbol);
      continue;
    }

    const object = {
      name,
      symbol,
      market_cap,
      exchange,
      asset_type,
      price_currency,
      start_date,
      end_date,
    };

    results.push(object);
  }

  console.log(results.length);
  console.log(fails.length);
  console.log(missing.length);

  await fs.writeFile(
    './src/development_assets/failed.json',
    JSON.stringify(fails)
  );
  await fs.writeFile(
    './src/development_assets/success.json',
    JSON.stringify(results)
  );
  await fs.writeFile(
    './src/development_assets/missing.json',
    JSON.stringify(missing)
  );
};

const seedTop3500TickerDB = async () => {
  const input = await fs.readFile(
    './src/development_assets/top_3500_US.json',
    'utf-8'
  );
  const json = JSON.parse(input);

  const parsed = tickersSchema.parse(json);

  await TickerDB.recreateTable();

  await TickerDB.createData(parsed);
};

const seedTop3500MarketDataDB = async () => {
  let fails: string[] = [];
  console.log('Starting to seed market data');
  const tickers = await TickerDB.findAllTickers();
  console.log(`Found ${tickers.length} tickers`);
  await MarketDataDB.recreateTable();
  console.log('Recreated table');

  for (const ticker of tickers) {
    console.log(`Getting data for ${ticker}`);

    try {
      const results = await MDP.getEODDataFromTo(
        [ticker],
        new Date('2013-01-01'),
        new Date()
      );
      console.log(`Fetched ${results.length} results`);
      console.log(`Saving to file`);
      const parsed = marketDataSchema.parse(results);
      await fs.writeFile(
        `./src/development_assets/top_3500/${ticker}.json`,
        JSON.stringify(results)
      );
      console.log('Writing to database');
      await MarketDataDB.createData(parsed);
    } catch (err) {
      console.log(`Error fetching data for ${ticker}`);
      fails.push(ticker);
      console.log(err);
    }
  }

  console.log(`Failed to fetch data for ${fails.length} tickers`);
  console.log(fails);
  await fs.writeFile(
    `./src/development_assets/top_3500/fails.json`,
    JSON.stringify(fails)
  );
};

// seedTop3500MarketDataDB();

// seedTop3500TickerDB();

// readAndParseMarketCapData();

// const results = await MDP.getFundamentalsFrom(
//   ['AAPL', 'MSFT'],
//   new Date('2023-03-16')
// );

// console.log(results);

// testDataBase();

// readAndParse();
// getManyTickersData();
// getTickerData();
// seedDataBase();

// readAndParseTickerData();

// runModel();
runOneBacktest();
