import StrategyDB from "../database_provider/model_strategy.js";
import StrategySignalDB from "../database_provider/model_strategySignal.js";
import TickerDB from "../database_provider/model_tickers.js";
import { getSignal } from "../position_computer/index.js";
import { StrategySignals } from "../types/index.js";
import { Job } from "./index.js";

export const runRefreshStrategy = async (job: Job, strategy: string) => {
    job.status = "running";
    job.progress = 0;

    console.log(`Refreshing strategy ${strategy}`);
    const tickers = await TickerDB.findAllTickers();
    // const slicedTickers = tickers.slice(0, 10);
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

        job.progress =+ batch.length / jobLength;

        batch = getNextTickerBatch();
        index++;
      }
  
      console.log(
        `Tested ${slicedTickers.length} tickers and found ${results.length} signals.`
      );
  
      job.status="saving results";
      // await writeFile('strategies.json', JSON.stringify(results));
  
      await StrategySignalDB.createData(results);
  
      await StrategyDB.updateStrategy(
        strategy,
        new Date(),
        results.length
      );
  
        job.status="idling";
    } catch (err) {
      console.log(err);
      job.status="error";
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
  
  routes.get('/marketdata/getlatesttrade/:ticker', async (req, res) => {
    try {
      const ticker = req.params.ticker;
      const latest_trade = await Trader.getLastTrade_v2({ symbol: ticker });
      const price = latest_trade.trade.p;
  
      res.status(200).send({ price });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: 'Error while fetching latest trade' });
    }
  });
  
  routes.post('/trades/place', async (req, res) => {
    try {
      const trades = tradesSchema.parse(req.body);
  
      let successfulTrades = [...trades].slice(0, 1);
      let failedTrades = [...trades].slice(1, 2).map((trade) => ({
        trade,
        error: 'Not enough cash!',
      }));
  
      let response: PlaceTradesResponse = {
        successful_trades: successfulTrades,
        unsuccessful_trades: failedTrades,
      };
  
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: 'Error parsing trades' });
    }
  }