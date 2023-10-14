import got, { RequestError } from 'got';
import MarketDataDB from '../database_provider/model_marketdata.js';
import { StrategySignal, StrategyTickerData } from '../types/index.js';
import {
  strategySignalResponseSchema,
  strategySignalSchema,
  strategyTickerDataSchema,
} from '../schemas/index.js';
import config from '../config/index.js';
import MarketDataProvider from '../market_data_provider/tiingo/index.js';
config();
const URL_STRATEGIES = process.env.URL_STRATEGIES || 'http://localhost:4000';

/**
 * Fetches the latest signal for a specific ticker from the conservative strategy service.
 * This function always uses the database as the data source.
 *
 * @param {string} strategy - The strategy to use to create signals.
 * @param {string} ticker - The ticker symbol of the stock to fetch the signal for.
 * @returns {Promise<StrategySignal | null>} A promise that resolves to the latest strategy signal
 * for the specified ticker, or null if the signal cannot be retrieved or if the ticker data length
 * is less than 200.
 *
 * @throws {Error} If there is an error while fetching the signal from the strategy service.
 *
 * @example
 *
 * getSignal("conservative", "AAPL")
 *   .then(signal => console.log(signal))
 *   .catch(error => console.error(error));
 */
export const getStrategySignal = async (
  strategy: string,
  ticker: string
): Promise<StrategySignal | null> => {
  const url = `${URL_STRATEGIES}/${strategy}/signal`;
  // const url = 'http://127.0.0.1:4000/conservative/signal';
  const dateOffset = 300 * 24 * 60 * 60 * 1000; // 300 days
  // const dateOffset = 100 * 24 * 60 * 60 * 1000; // 100 days
  // const dateOffset = 10 * 24 * 60 * 60 * 1000; // 10 days
  const toDate = new Date();
  const fromDate = new Date(toDate.getTime() - dateOffset);

  console.log(`Getting signal for ${ticker} from ${fromDate} to ${toDate}.`);

  // console.time('getdata' + ticker);

  const tickerData = await MarketDataDB.readData([ticker], fromDate, toDate);
  // console.timeEnd('getdata' + ticker);

  if (tickerData.length < 200) return null;

  try {
    const response = await got
      .post(url, {
        headers: { 'Content-Type': 'application/json' },
        json: tickerData,
      })
      .json();

    let parsedResponse = strategySignalResponseSchema.parse(response);

    if (parsedResponse.signal === '') return null;

    let parsedSignal = strategySignalSchema.parse(parsedResponse);

    return parsedSignal;
  } catch (err: any) {
    if (err instanceof RequestError) {
      console.log('RequestError in getSignal: ', ticker);
      console.log(err.code);
    } else {
      console.log('Unkonwn error in getSignal: ', ticker);
      console.log(err);
    }
  }

  return null;
};

/**
 * Fetches all the signals for a specific ticker from the conservative strategy service.
 *
 * @param {string} strategy - The strategy to use to create signals.
 * @param {string} ticker - The ticker symbol of the stock to fetch the market data for.
 * @param {string} dataSource - The data source to use for the market data. Can be either "database" or "market". The default is "database".
 * @returns {Promise<StrategyTickerData | null>} A promise that resolves to the latest market data
 * for the specified ticker, or null if the data cannot be retrieved or if the ticker data length
 * is less than 200.
 *
 * @throws {Error} If there is an error while fetching the market data from the strategy service.
 *
 * @example
 *
 * getTickerData("conservative", "AAPL", "market")
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 */
export const getStrategyTickerData = async (
  strategy: string,
  ticker: string,
  dataSource: 'database' | 'market' = 'database'
): Promise<StrategyTickerData | null> => {
  const url = `${URL_STRATEGIES}/${strategy}`;
  const dateOffset = 400 * 24 * 60 * 60 * 1000; // 400 days
  const toDate = new Date();
  const fromDate = new Date(toDate.getTime() - dateOffset);
  const useDatabase = dataSource === 'database';

  console.log(`Getting signal for ${ticker} from ${fromDate} to ${toDate}.`);

  const tickerData = useDatabase
    ? await MarketDataDB.readData([ticker], fromDate, toDate)
    : await MarketDataProvider.getEODDataFromTo(ticker, fromDate, toDate);

  if (tickerData.length < 200) return null;

  try {
    const response = await got
      .post(url, {
        headers: { 'Content-Type': 'application/json' },
        json: tickerData,
      })
      .json();

    const parsed = strategyTickerDataSchema.parse(response);

    return parsed;
  } catch (err) {
    console.log('Error in getData: ', ticker);
  }

  return null;
};
