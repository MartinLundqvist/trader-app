import router from 'express';
import StrategySignalDB from '../database_provider/model_strategySignal.js';
import { getStrategyTickerData } from '../position_computer/index.js';
import StrategyDB from '../database_provider/model_strategy.js';
import TickerDB from '../database_provider/model_tickers.js';
import { MarketDataInformation, Trades } from '../types/index.js';
import MarketDataDB from '../database_provider/model_marketdata.js';
import { tradesSchema } from '../schemas/index.js';
import Trader from '../broker_provider/index.js';
import JobsProvider from '../jobs_provider/index.js';
import { PlaceOrder } from '../broker_provider/alpaca/params.js';
import PlacedTradesDB from '../database_provider/model_placedTrade.js';
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
  const { strategyName, ticker } = req.params;

  console.log(
    `Fetching ticker data for strategy ${strategyName} and ticker ${ticker}`
  );
  try {
    // We use live market data.
    const results = await getStrategyTickerData(strategyName, ticker, 'market');
    res.status(200).send(results);
  } catch (err) {
    res.status(500).send({
      error: `Error while fetching signals for ticker ${req.params.ticker}`,
    });
  }
});

routes.get('/strategies/refresh/:strategyName', async (req, res) => {
  JobsProvider.addJob({
    id: 'refresh-strategy',
    variables: [req.params.strategyName],
  });

  res.status(200).send({ message: 'Job added' });
});

routes.get('/marketdata/refresh', async (req, res) => {
  JobsProvider.addJob({
    id: 'refresh-market-data',
    variables: [],
  });

  res.status(200).send({ message: 'Job added' });
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

routes.get('/marketdata/getlatestnews/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker;
    const news = await MarketDataProvider.getLatestNews(ticker);

    res.status(200).send({ news });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Error while fetching latest news' });
  }
});

routes.post('/trades/place', async (req, res) => {
  let trades: Trades = [];
  const tradesToPlace: PlaceOrder[] = [];

  try {
    trades = tradesSchema.parse(req.body);

    JobsProvider.addJob({
      id: 'place-orders',
      variables: [],
      trades,
    });

    res.status(200).send({ message: 'Job added' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Error parsing trades' });
  }
});

routes.get('/jobs', async (req, res) => {
  let jobs = JobsProvider.getJobs();

  res.status(200).send(jobs);
});

routes.get('/account', async (req, res) => {
  try {
    const account = await Trader.getAccount();

    res.status(200).send(account);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Error while fetching account' });
  }
});

routes.get('/placedtrades', async (req, res) => {
  try {
    const placed_trades = await PlacedTradesDB.findAllTrades();

    res.status(200).send(placed_trades);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Error while fetching placed trades' });
  }
});

routes.get('/positions', async (req, res) => {
  try {
    const positions = await Trader.getPositions();

    res.status(200).send(positions);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Error while fetching positions' });
  }
});

routes.get('/orders', async (req, res) => {
  try {
    const orders = await Trader.getOrders({ status: 'all', nested: true });

    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send({ error: 'Error while fetching orders' });
  }
});

routes.get('/positions/close/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker;
    const positions = await Trader.getPositions();
    const position = positions.find((p) => p.symbol === ticker);

    if (position) {
      await Trader.closePosition({ symbol: ticker });
      res
        .status(200)
        .send({ message: `Position ${ticker} closed`, success: true });
    } else {
      res.status(404).send({ error: `Position ${ticker} not found` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Error while closing position' });
  }
});
