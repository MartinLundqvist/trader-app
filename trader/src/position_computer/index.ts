import got from 'got';
// import { AAPL } from '../development_assets/AAPLJan2023.js';
// import { AAPL } from '../development_assets/AAPL3Months.js';
import { AAPL } from '../development_assets/AAPL12Months.js';
import { MSFT } from '../development_assets/MSFT12Months.js';
import { AMZN } from '../development_assets/AMZN12Months.js';
import { GOOG } from '../development_assets/GOOG12Months.js';
import { VOD } from '../development_assets/VOD12Months.js';
import { PEP } from '../development_assets/PEP12Months.js';
import { TSLA } from '../development_assets/TSLA12Months.js';
import { MarketData } from '../types/index.js';

const tickers: { [key: string]: MarketData } = {
  AAPL: AAPL,
  MSFT: MSFT,
  AMZN: AMZN.filter((datum) => datum.date > new Date('2022-06-06')),
  GOOG: GOOG.filter((datum) => datum.date > new Date('2022-07-18')), // 2022-07-18T00:00:00.000Z stock was split
  VOD: VOD,
  PEP: PEP,
  TSLA: TSLA.filter((datum) => datum.date > new Date('2022-08-25')), // 2022-08-25T00:00:00.000Z stock was split
};

export const getSignal = async (ticker: string) => {
  const url = 'http://127.0.0.1:4000/test';
  const response = await got.post(url, {
    headers: { 'Content-Type': 'application/json' },
    json: tickers[ticker],
  });

  return response.body;
};
