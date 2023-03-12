import got from 'got';
// import { AAPL } from '../market_data_provider/marketstack/AAPLJan2023.js';
// import { AAPL } from '../market_data_provider/marketstack/AAPL3Months.js';
import { AAPL } from '../market_data_provider/marketstack/AAPL12Months.js';
import { MSFT } from '../market_data_provider/marketstack/MSFT12Months.js';
import { AMZN } from '../market_data_provider/marketstack/AMZN12Months.js';
import { GOOG } from '../market_data_provider/marketstack/GOOG12Months.js';
import { VOD } from '../market_data_provider/marketstack/VOD12Months.js';
import { PEP } from '../market_data_provider/marketstack/PEP12Months.js';
import { TSLA } from '../market_data_provider/marketstack/TSLA12Months.js';
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
