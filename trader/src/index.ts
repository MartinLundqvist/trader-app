import MDP from './market_data_provider/index.js';
import { writeFile } from 'fs/promises';
import { getSignal } from './position_computer/index.js';

const runModel = async () => {
  let data = await getSignal('GOOG');
  data = await getSignal('AMZN');
  data = await getSignal('TSLA');
  data = await getSignal('MSFT');
  data = await getSignal('PEP');
  data = await getSignal('VOD');
  data = await getSignal('AAPL');
};

const getTickerData = async () => {
  const data = await MDP.getEODDataFromTo(
    ['TSLA'],
    new Date('2022-02-01'),
    new Date('2023-02-28')
  );

  await writeFile('TSLA12Months.json', JSON.stringify(data));
};

const test = async () => {
  const data = await MDP.getEODDataFromTo(
    ['TSLA'],
    new Date('2022-08-20'),
    new Date('2022-08-30')
  );

  await writeFile('tsla_Splits.json', JSON.stringify(data));
};

runModel();
