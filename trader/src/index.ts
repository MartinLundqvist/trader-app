import MDP from './market_data_provider/index.js';
// import { writeFile } from 'fs/promises';

const dataFT = await MDP.getEODDataFromTo(
  ['AAPL'],
  new Date('2023-03-01'),
  new Date('2023-03-04')
);
console.log(dataFT);

const dataLatest = await MDP.getLatestEODData(['AAPL']);

console.log(dataLatest);

// await writeFile('./data4.json', JSON.stringify(data));
