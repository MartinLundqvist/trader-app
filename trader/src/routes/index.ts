import router from 'express';
import StrategyDB from '../database_provider/model_strategies.js';
import { getData } from '../position_computer/index.js';

export const routes = router();

routes.get('/strategies', async (req, res) => {
  try {
    const results = await StrategyDB.findAllStrategies();

    res.send(results);
  } catch (err) {
    res.send({ error: 'Error while fetching strategies' });
  }
});

routes.get('/signals/:strategyName', async (req, res) => {
  try {
    const results = await StrategyDB.findLatestSignalsForStrategy(
      req.params.strategyName
    );
    res.send(results);
  } catch (err) {
    res.send({ error: 'Error while fetching signals' });
  }
});

routes.get('/tickerdata/:strategyName/:ticker', async (req, res) => {
  try {
    const results = await getData(req.params.ticker);
    res.send(results);
  } catch (err) {
    res.send({
      error: `Error while fetching signals for ticker ${req.params.ticker}`,
    });
  }
});
