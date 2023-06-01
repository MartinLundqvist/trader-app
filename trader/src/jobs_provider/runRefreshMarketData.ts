import MarketDataDB from '../database_provider/model_marketdata.js';
import TickerDB from '../database_provider/model_tickers.js';
import MarketDataProvider from '../market_data_provider/tiingo/index.js';
import { Job, MarketData } from '../types/index.js';

export const runRefreshMarketData = async (job: Job) => {
  job.status = 'running';
  job.progress = 0;

  try {
    const lastestDate = await MarketDataDB.getLatestDate();
    const oneDayOffset = 1000 * 60 * 60 * 24;
    const fromDate = new Date(lastestDate.getTime() + oneDayOffset);
    const toDate = new Date();

    const tickers = await TickerDB.findAllTickers();

    const tickerQueue = [...tickers];
    const concurrency = 100;
    const results: MarketData = [];
    let jobLength = tickerQueue.length;

    const getNextTickerBatch = () => {
      if (tickerQueue.length === 0) return null;
      return tickerQueue.splice(0, concurrency);
    };

    const runPromisesBatch = async (tickerBatch: string[]) => {
      const promisesBatch = tickerBatch.map((ticker) =>
        MarketDataProvider.getEODDataFromTo(ticker, fromDate, toDate)
      );

      return await Promise.all(promisesBatch);
    };

    let batch = getNextTickerBatch();
    let index = 1;

    while (batch) {
      console.log(`Running batch ${index} with ${batch.length} tickers...`);
      job.message = `Running batch ${index} with ${batch.length} tickers...`;
      const batchResults = (await runPromisesBatch(batch)).flat();
      results.push(...batchResults);

      job.progress += batch.length / jobLength;

      batch = getNextTickerBatch();
      index++;
    }

    let message = await MarketDataDB.createData(results);
    // let message = 'Market data refreshed';

    job.status = 'completed';
    job.message = message;
  } catch (err) {
    console.log(err);
    job.status = 'failed';
    job.message = 'Error while refreshing market data';
  }
};
