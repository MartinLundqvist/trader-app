// import MDP from './market_data_provider/index.js';
// import { writeFile } from 'fs/promises';

// const data = await MDP.getEODDataFromTo(
//   ['AMZN'],
//   new Date('2022-02-01'),
//   new Date('2023-02-28')
// );

// await writeFile('AMZN12Months.json', JSON.stringify(data));

import { getSignal } from './position_computer/index.js';
getSignal('').then((data) => console.log(data));
