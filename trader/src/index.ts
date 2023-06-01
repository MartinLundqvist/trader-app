import express from 'express';
import cors from 'cors';
import { routes } from './routes/index.js';
import { config } from 'dotenv';
import JobsProvider from './jobs_provider/index.js';
// import StrategySignalDB from './database_provider/model_strategySignal.js';
// import StrategyDB from './database_provider/model_strategy.js';
config();

const PORT = Number(process.env.PORT) || 4001;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

JobsProvider.startJobs(1000);

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
