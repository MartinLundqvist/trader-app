import StrategyDB from '../database_provider/model_strategy.js';
import StrategySignalDB from '../database_provider/model_strategySignal.js';
import TickerDB from '../database_provider/model_tickers.js';
import { getStrategySignal } from '../position_computer/index.js';
import { Job, StrategySignals } from '../types/index.js';

export const runRefreshStrategy = async (job: Job) => {
  job.status = 'running';
  job.progress = 0;
  const strategy = job.variables[0];

  console.log(`Refreshing strategy ${strategy}`);
  const tickers = await TickerDB.findAllTickers();
  // const slicedTickers = tickers.slice(0, 10); // This is for testing
  const slicedTickers = tickers;
  const tickerQueue = [...slicedTickers];
  const concurrency = 100;
  let results: StrategySignals = [];
  let jobLength = slicedTickers.length;

  try {
    const getNextTickerBatch = () => {
      if (tickerQueue.length === 0) return null;
      return tickerQueue.splice(0, concurrency);
    };

    const runPromisesBatch = async (tickerBatch: string[]) => {
      const promisesBatch = tickerBatch.map((ticker) =>
        getStrategySignal(strategy, ticker)
      );
      return await Promise.all(promisesBatch);
    };

    let batch = getNextTickerBatch();
    let index = 1;

    while (batch) {
      console.log(`Running batch ${index} with ${batch.length} tickers...`);
      job.message = `Running batch ${index} with ${batch.length} tickers...`;
      const batchResults = (await runPromisesBatch(batch)).flat();
      for (let result of batchResults) {
        if (result) {
          results.push(result);
        }
      }

      job.progress += batch.length / jobLength;

      batch = getNextTickerBatch();
      index++;
    }

    console.log(
      `Tested ${slicedTickers.length} tickers and found ${results.length} signals.`
    );

    job.message = `Tested ${slicedTickers.length} tickers and found ${results.length} signals.`;

    await StrategySignalDB.createData(results);

    await StrategyDB.updateStrategy(strategy, new Date(), results.length);

    job.status = 'completed';
  } catch (err) {
    console.log(err);
    job.status = 'failed';
    job.message = 'Error while refreshing strategy';
  }
};
