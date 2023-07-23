import express from 'express';
import cors from 'cors';
import { routes } from './routes/index.js';
import JobsProvider from './jobs_provider/index.js';
import config from './config/index.js';
import { CronJob } from 'cron';

config();

console.log(process.env.NODE_ENV);
console.log(process.env.URL_POSTGRES);

const PORT = Number(process.env.PORT) || 4001;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

// Start cron jobs to update the market data at the end of every day, and then re-run the strategy signal hunter 10 minutes later
const cronJobRefreshMarketData = new CronJob('0 0 5 * * *', () => {
  const date = new Date();
  console.log(date.toISOString() + ': Refreshing market data');

  JobsProvider.addJob({
    id: 'refresh-market-data',
    variables: [],
  });
});

const cronJobRefreshStrategy = new CronJob('0 10 5 * * *', () => {
  const date = new Date();
  console.log(date.toISOString() + ': Refreshing strategy signals');

  JobsProvider.addJob({
    id: 'refresh-strategy',
    variables: ['conservative'],
  });
});

cronJobRefreshMarketData.start();
cronJobRefreshStrategy.start();

JobsProvider.startJobs(1000);

// await PlacedTradesDB.recreateTable();

// JobsProvider.addJob({
//   id: 'refresh-strategy',
//   variables: ['conservative'],
// });

// await StrategyDB.recreateTable();
// await StrategyDB.createData([
//   {
//     name: 'conservative',
//     description_long:
//       'This strategy uses Bollinger Bands and Moving Averages to determine when to buy and sell.',
//     description_short: 'Bollinger Bands and Moving Averages',
//     last_run_date: new Date('2023-04-26'),
//     last_run_ticker_count: 59,
//   },
// ]);

// await StrategySignalDB.recreateTable();
