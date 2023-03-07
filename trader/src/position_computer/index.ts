import got from 'got';
// import { AAPL } from '../market_data_provider/marketstack/AAPLJan2023.js';
// import { AAPL } from '../market_data_provider/marketstack/AAPL3Months.js';
import { AAPL } from '../market_data_provider/marketstack/AAPL12Months.js';
import { MSFT } from '../market_data_provider/marketstack/MSFT12Months.js';

export const getSignal = async (ticker: string) => {
  const url = 'http://127.0.0.1:4000/test';
  const response = await got.post(url, {
    headers: { 'Content-Type': 'application/json' },
    json: MSFT,
  });

  return response.body;
};
