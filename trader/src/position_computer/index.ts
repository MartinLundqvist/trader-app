import got from 'got';
import MarketDataDB from '../database_provider/model_marketdata.js';
import { StrategySignal, StrategyTickerData } from '../types/index.js';
import {
  strategySignalResponseSchema,
  strategySignalSchema,
  strategyTickerDataSchema,
} from '../schemas/index.js';
/**
 * Fetches the latest signal for a specific ticker from the conservative strategy service.
 *
 * @param {string} ticker - The ticker symbol of the stock to fetch the signal for.
 * @returns {Promise<StrategySignal | null>} A promise that resolves to the latest strategy signal
 * for the specified ticker, or null if the signal cannot be retrieved or if the ticker data length
 * is less than 200.
 *
 * @throws {Error} If there is an error while fetching the signal from the strategy service.
 *
 * @example
 *
 * getSignal("AAPL")
 *   .then(signal => console.log(signal))
 *   .catch(error => console.error(error));
 */
export const getSignal = async (
  ticker: string
): Promise<StrategySignal | null> => {
  const url = 'http://127.0.0.1:4000/conservative/signal';
  const dateOffset = 400 * 24 * 60 * 60 * 1000; // 400 days
  // const dateOffset = 100 * 24 * 60 * 60 * 1000; // 100 days
  // const dateOffset = 10 * 24 * 60 * 60 * 1000; // 10 days
  const toDate = new Date();
  const fromDate = new Date(toDate.getTime() - dateOffset);

  console.log(`Getting signal for ${ticker} from ${fromDate} to ${toDate}.`);

  const tickerData = await MarketDataDB.readData([ticker], fromDate, toDate);

  if (tickerData.length < 200) return null;

  try {
    const response = await got
      .post(url, {
        headers: { 'Content-Type': 'application/json' },
        json: tickerData,
      })
      .json();

    // console.log(response);

    // const parsed = strategiesSchema.parse(response);

    let parsedResponse = strategySignalResponseSchema.parse(response);

    if (parsedResponse.signal === '') return null;

    let parsedSignal = strategySignalSchema.parse(parsedResponse);

    return parsedSignal;
  } catch (err) {
    console.log('Error in getSignal: ', ticker);
    console.log(err);
  }

  return null;
};

/**
 * Fetches the latest ticker data for a specific ticker from the conservative strategy service.
 *
 * @param {string} ticker - The ticker symbol of the stock to fetch the market data for.
 * @returns {Promise<StrategyTickerData | null>} A promise that resolves to the latest market data
 * for the specified ticker, or null if the data cannot be retrieved or if the ticker data length
 * is less than 200.
 *
 * @throws {Error} If there is an error while fetching the market data from the strategy service.
 *
 * @example
 *
 * getTickerData("AAPL")
 *   .then(data => console.log(data))
 *   .catch(error => console.error(error));
 */
export const getTickerData = async (
  ticker: string
): Promise<StrategyTickerData | null> => {
  const url = 'http://127.0.0.1:4000/conservative';
  const dateOffset = 400 * 24 * 60 * 60 * 1000; // 400 days
  // const dateOffset = 100 * 24 * 60 * 60 * 1000; // 100 days
  // const dateOffset = 10 * 24 * 60 * 60 * 1000; // 10 days
  const toDate = new Date();
  const fromDate = new Date(toDate.getTime() - dateOffset);

  console.log(`Getting signal for ${ticker} from ${fromDate} to ${toDate}.`);

  const tickerData = await MarketDataDB.readData([ticker], fromDate, toDate);

  if (tickerData.length < 200) return null;

  try {
    const response = await got
      .post(url, {
        headers: { 'Content-Type': 'application/json' },
        json: tickerData,
      })
      .json();

    // console.log(response);
    // await writeFile('./response.json', JSON.stringify(response));
    const parsed = strategyTickerDataSchema.parse(response);
    // const parsed = response;

    return parsed;
  } catch (err) {
    console.log('Error in getData: ', ticker);
    // await writeFile('./error.json', JSON.stringify(err));
    // console.log(err);
  }

  return null;
};
