import router from 'express';
import StrategySignalDB from '../database_provider/model_strategySignal.js';
import { getData, getSignal } from '../position_computer/index.js';
import StrategyDB from '../database_provider/model_strategy.js';
import TickerDB from '../database_provider/model_tickers.js';
import { StrategySignals } from '../types/index.js';
import { writeFile } from 'fs/promises';

export const routes = router();

routes.get('/strategies', async (req, res) => {
  console.log(`Fetching strategies`);
  try {
    const results = await StrategyDB.findAllStrategies();

    res.send(results);
  } catch (err) {
    res.send({ error: 'Error while fetching strategies' });
  }
});

routes.get('/signals/:strategyName', async (req, res) => {
  console.log(`Fetching signals for ${req.params.strategyName}`);
  try {
    const results = await StrategySignalDB.findLatestSignalsForStrategy(
      req.params.strategyName
    );
    res.send(results);
  } catch (err) {
    res.send({ error: 'Error while fetching signals' });
  }
});

routes.get('/tickerdata/:strategyName/:ticker', async (req, res) => {
  console.log(
    `Fetching ticker data for strategy ${req.params.strategyName} and ticker ${req.params.ticker}`
  );
  try {
    const results = await getData(req.params.ticker);
    res.send(results);
  } catch (err) {
    res.send({
      error: `Error while fetching signals for ticker ${req.params.ticker}`,
    });
  }
});

routes.get('/strategies/refresh/:strategyName', async (req, res) => {
  console.log(`Refreshing strategy ${req.params.strategyName}`);
  try {
    const tickers = await TickerDB.findAllTickers();
    const slicedTickers = tickers.slice(0, 100);
    const tickerQueue = [...slicedTickers];
    const concurrency = 100;
    let results: StrategySignals = [];

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
        if (result && result.signal !== '') {
          results.push(result);
        }
      }

      batch = getNextTickerBatch();
      index++;
    }

    console.log(
      `Tested ${slicedTickers.length} tickers and found ${results.length} signals.`
    );

    await writeFile('strategies.json', JSON.stringify(results));

    res.send({
      message: `Tested ${slicedTickers.length} tickers and found ${results.length} signals.`,
    });
  } catch (err) {
    console.log(err);
    res.send({ error: 'Error while refreshing strategy' });
  }

  // await StrategySignalDB.createData(results);
});
