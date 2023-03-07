// import MDP from './market_data_provider/index.js';
// import { writeFile } from 'fs/promises';
// await writeFile('./data4.json', JSON.stringify(data));

import { getSignal } from './position_computer/index.js';

getSignal('').then((data) => console.log(data));
