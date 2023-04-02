// Load the latest market data for all symbols in the database

import { writeFile } from 'fs/promises';
import TickerDB from './database_provider/model_tickers.js';
import { getSignal } from './position_computer/index.js';
import { StrategyResponse } from './types/index.js';

// Throw the data at the strategies and collect signals
const runModel = async () => {
  const tickers = await TickerDB.findAllTickers();
  // const slicedTickers = tickers.slice(0, 5);
  const slicedTickers = tickers;
  let results: StrategyResponse[] = [];
  // const ticker = tickers[0];

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
};

runModel();
