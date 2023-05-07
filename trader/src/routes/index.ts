import router from 'express';
import StrategySignalDB from '../database_provider/model_strategySignal.js';
import { getData } from '../position_computer/index.js';
import StrategyDB from '../database_provider/model_strategy.js';

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
