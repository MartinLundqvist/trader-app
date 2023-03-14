// import MDP from './market_data_provider/marketstack/index.js';
import MDP from './market_data_provider/tiingo/index.js';
import { writeFile } from 'fs/promises';
import { getSignal } from './position_computer/index.js';
import { tickers } from './constants/100tickers.js';
import fs from 'fs/promises';
import { MarketData } from './types/index.js';
import json from './development_assets/100tickers12months.json' assert { type: 'json' };
import { marketDataSchema } from './schemas/index.js';

const runModel = async () => {
  let data = await getSignal('GOOG');
  data = await getSignal('AMZN');
  data = await getSignal('TSLA');
  data = await getSignal('MSFT');
  data = await getSignal('PEP');
  data = await getSignal('VOD');
  data = await getSignal('AAPL');
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

const readAndParse = async () => {
  const file = await fs.readFile(
    './src/development_assets/100tickers12months.json',
    'utf-8'
  );

  // const json: MarketData = JSON.parse(file);

  let nrEntries = 0;
  const tickers = new Map<string, number>();

  const marketdata = marketDataSchema.parse(json);

  for (const entry of marketdata) {
    nrEntries++;
    if (tickers.has(entry.symbol)) {
      let value = tickers.get(entry.symbol);
      tickers.set(entry.symbol, value! + 1);
    } else {
      tickers.set(entry.symbol, 0);
    }
  }

  console.log(tickers.size);
  console.log(tickers);
};

readAndParse();

// runModel();
// getManyTickersData();
// getTickerData();
