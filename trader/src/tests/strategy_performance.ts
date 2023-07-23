import TickerDB from '../database_provider/model_tickers.js';
import { getSignal } from '../position_computer/index.js';
import { StrategySignals } from '../types/index.js';

export const runStrategyPerformanceTest = async (
  strategy: string,
  nrTickers = 100
) => {
  console.log(`Refreshing strategy ${strategy}`);
  const tickers = await TickerDB.findAllTickers();
  const slicedTickers = tickers.slice(0, nrTickers);
  const tickerQueue = [...slicedTickers];
  const concurrency = 100;
  let results: StrategySignals = [];

  console.time('test');

  try {
    const getNextTickerBatch = () => {
      if (tickerQueue.length === 0) return null;
      return tickerQueue.splice(0, concurrency);
    };

    const runPromisesBatch = async (tickerBatch: string[]) => {
      const promisesBatch = tickerBatch.map((ticker) => getSignal(ticker));
      return await Promise.all(promisesBatch);
    };

    let batch = getNextTickerBatch();
    let index = 1;

    while (batch) {
      console.log(`Running batch ${index} with ${batch.length} tickers...`);
      const batchResults = (await runPromisesBatch(batch)).flat();
      for (let result of batchResults) {
        if (result) {
          results.push(result);
        }
      }

      batch = getNextTickerBatch();
      index++;
    }

    console.log(
      `Tested ${slicedTickers.length} tickers and found ${results.length} signals.`
    );

    // await writeFile('strategies.json', JSON.stringify(results));
  } catch (err) {
    console.log(err);
  }

  console.timeEnd('test');
};

console.log('Starting test...');
await runStrategyPerformanceTest('conservative', 1000);
