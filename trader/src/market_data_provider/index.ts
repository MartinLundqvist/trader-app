import got from 'got';
import { marketDataSchema } from '../schemas/index.js';
import { MarketData, MarketstackAPIResponse } from '../types/index.js';
import { fromDateToString } from '../utils/index.js';
import {
  BASE_URL,
  END_POINT_TICKERS,
  END_POINT_EOD,
  END_POINT_EOD_LATEST,
  AUTHORIZATION,
} from './marketstack/constants.js';

const getTickersFromExchange = async (mic: string) => {
  const response = await got(
    `${BASE_URL}/${END_POINT_TICKERS(mic)}?${AUTHORIZATION}`
  );
  return JSON.parse(response.body);
};

const getEODDataFromTo = async (
  tickers: string[],
  date_from: Date,
  date_to: Date
): Promise<MarketData> => {
  let results: MarketData = [];

  try {
    // Pagination
    let done = false;
    const LIMIT = 100;
    let offset = 0;

    while (!done) {
      const response = await got<MarketstackAPIResponse>(
        `${BASE_URL}/${END_POINT_EOD}?${AUTHORIZATION}&symbols=${tickers.join(
          ','
        )}&date_from=${fromDateToString(date_from)}&date_to=${fromDateToString(
          date_to
        )}&limit=${LIMIT}&offset=${offset}`,
        { responseType: 'json' }
      );

      const data = response?.body;

      if (!Array.isArray(data.data)) {
        throw new Error('No data returned from API');
      }

      results = results.concat(marketDataSchema.parse(data.data));

      console.log(`I am at ${offset} of ${data.pagination.total} records.`);

      if (offset + LIMIT >= data.pagination.total) {
        done = true;
        console.log(`Done - I have collected ${results.length} records.`);
      }

      offset += LIMIT;
    }
  } catch (error) {
    console.log(error);
  }

  return results;
};

const getLatestEODData = async (tickers: string[]): Promise<MarketData> => {
  let results: MarketData = [];

  try {
    const response = await got<MarketstackAPIResponse>(
      `${BASE_URL}/${END_POINT_EOD_LATEST}?${AUTHORIZATION}&symbols=${tickers.join(
        ','
      )}`,
      { responseType: 'json' }
    );

    const data = response?.body;

    if (!Array.isArray(data.data)) {
      throw new Error('No data returned from API');
    }

    results = marketDataSchema.parse(data.data);
  } catch (error) {
    console.log(error);
  }

  return results;
};

const MarketDataProvider = {
  getTickersFromExchange,
  getEODDataFromTo,
  getLatestEODData,
};

export default MarketDataProvider;
