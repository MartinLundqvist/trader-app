import router from 'express';
import StrategySignalDB from '../database_provider/model_strategySignal.js';
import { getTickerData, getSignal } from '../position_computer/index.js';
import StrategyDB from '../database_provider/model_strategy.js';
import TickerDB from '../database_provider/model_tickers.js';
import { MarketDataInformation, StrategySignals } from '../types/index.js';
import MarketDataDB from '../database_provider/model_marketdata.js';
import MarketDataProvider from '../market_data_provider/tiingo/index.js';

export const routes = router();

routes.get('/strategies', async (req, res) => {
  console.log(`Fetching strategies`);
  try {
    const results = await StrategyDB.findAllStrategies();

    res.status(200).send(results);
  } catch (err) {
    res.status(500).send({ error: 'Error while fetching strategies' });
  }
});

routes.get('/signals/:strategyName', async (req, res) => {
  console.log(`Fetching signals for ${req.params.strategyName}`);
  try {
    const results = await StrategySignalDB.findLatestSignalsForStrategy(
      req.params.strategyName
    );
    res.status(200).send(results);
  } catch (err) {
    res.status(500).send({ error: 'Error while fetching signals' });
  }
});

routes.get('/tickerdata/:strategyName/:ticker', async (req, res) => {
  console.log(
    `Fetching ticker data for strategy ${req.params.strategyName} and ticker ${req.params.ticker}`
  );
  try {
    const results = await getTickerData(req.params.ticker);
    res.status(200).send(results);
  } catch (err) {
    res.status(500).send({
      error: `Error while fetching signals for ticker ${req.params.ticker}`,
    });
  }
});

routes.get('/strategies/refresh/:strategyName', async (req, res) => {
  console.log(`Refreshing strategy ${req.params.strategyName}`);
  const tickers = await TickerDB.findAllTickers();
  const slicedTickers = tickers;
  const tickerQueue = [...slicedTickers];
  const concurrency = 100;
  let results: StrategySignals = [];

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

    await StrategySignalDB.createData(results);

    await StrategyDB.updateStrategy(
      req.params.strategyName,
      new Date(),
      results.length
    );

    res.status(200).send({
      message: `Tested ${slicedTickers.length} tickers and found ${results.length} signals.`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Error while refreshing strategy' });
  }
});

routes.get('/marketdata/refresh', async (req, res) => {
  try {
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

    // const data: MarketData = [];

    // For testing, write data to a file
    // await writeFile(
    //   `marketdata_test_${toDate.toISOString()}.json`,
    //   JSON.stringify(data)
    // );

    let message = await MarketDataDB.createData(data);
    // let message = 'Market data refreshed';

    res.status(200).send({ message });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Error while refreshing market data' });
  }
});

routes.get('/marketdata/information', async (req, res) => {
  let result: MarketDataInformation;

  try {
    const number_of_symbols = await TickerDB.getNrTickers();
    const last_updated = await MarketDataDB.getLatestDate();

    result = {
      number_of_symbols,
      last_updated,
    };

    res.status(200).send(result);
  } catch (err) {
    res
      .status(500)
      .send({ error: 'Error while fetching market data information' });
  }
});
