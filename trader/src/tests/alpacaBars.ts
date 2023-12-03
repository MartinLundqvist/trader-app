import { GetMultiBars } from '../broker_provider/alpaca/params.js';
import Trader from '../broker_provider/index.js';
import getConfiguration from '../config/index.js';
import { MarketData } from '../types/index.js';
getConfiguration();

const test = async () => {
  const options: GetMultiBars = {
    symbols: ['AAPL'],
    start: new Date('2023-01-01T00:00:00.000Z'),
    end: new Date('2023-11-30'),
    timeframe: '1Day',
    feed: 'iex',
    adjustment: 'all',
  };

  const parsed: MarketData = [];

  try {
    const results = await Trader.getMultiBars(options);

    for (let [symbol, bars] of Object.entries(results.bars)) {
      bars.forEach((bar) => {
        parsed.push({
          date: new Date(bar.t),
          symbol,
          open: bar.o,
          high: bar.h,
          low: bar.l,
          close: bar.c,
          volume: bar.v,
          adj_close: bar.c,
          adj_high: bar.h,
          adj_low: bar.l,
          adj_open: bar.o,
          split_factor: Number.NaN,
        });
      });
    }

    console.log(parsed);
  } catch (err) {
    console.log(err);
  }
};

test();
