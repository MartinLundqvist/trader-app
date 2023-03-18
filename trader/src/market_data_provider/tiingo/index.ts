import {
  Fundamentals,
  MarketData,
  TiingoAPIResponse,
} from '../../types/index.js';
import got, { OptionsOfJSONResponseBody } from 'got';
import {
  AUTHORIZATION,
  DAILY_URL,
  END_POINT_DAILY,
  END_POINT_EOD,
  FUNDAMENTALS_URL,
} from './constants.js';
import { fromDateToString } from '../../utils/index.js';
import { fundamentalsSchema, marketDataSchema } from '../../schemas/index.js';

const getEODDataFromTo = async (
  tickers: string[],
  dateFrom: Date,
  dateTo: Date
): Promise<MarketData> => {
  const results: MarketData = [];

  for (let ticker of tickers) {
    console.log(`Fetching data for ${ticker}...`);

    try {
      const url = `${DAILY_URL}/${ticker}/${END_POINT_EOD}?${AUTHORIZATION}&startDate=${fromDateToString(
        dateFrom
      )}&endDate=${fromDateToString(dateTo)}&format=json&resampleFreq=daily`;
      const options: OptionsOfJSONResponseBody = {
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      console.log(url);

      const response = await got<TiingoAPIResponse>(url, options);

      const data = response?.body;

      if (!Array.isArray(data)) {
        throw new Error('No data returned from API');
      }

      for (let datum of data) {
        datum.exchange = '';
        datum.symbol = ticker;
        datum.adj_close = datum.adjClose;
        datum.adj_high = datum.adjHigh;
        datum.adj_low = datum.adjLow;
        datum.adj_open = datum.adjOpen;
        datum.split_factor = datum.splitFactor;
      }

      let parsed = marketDataSchema.parse(data);

      if (parsed.length > 0) {
        results.push(...parsed);
      }
    } catch (error) {
      console.log(`Error while fetching data for ${ticker}`);
      console.log(error);
    }
  }

  return results;
};

// TODO: Clean up and type up
const getFundamentalsFrom = async (tickers: string[], dateFrom: Date) => {
  const results: Fundamentals = [];

  for (let ticker of tickers) {
    console.log(`Fetching data for ${ticker}...`);

    try {
      const url = `${FUNDAMENTALS_URL}/${ticker}/${END_POINT_DAILY}?${AUTHORIZATION}&startDate=${fromDateToString(
        dateFrom
      )}&format=json`;
      const options: OptionsOfJSONResponseBody = {
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      console.log(url);

      const response = await got<unknown>(url, options);

      const data = response?.body;

      if (!Array.isArray(data)) {
        throw new Error('No data returned from API');
      }

      // results.push(...data);

      for (let datum of data) {
        datum.market_cap = datum.marketCap;
        datum.symbol = ticker;
      }

      let parsed = fundamentalsSchema.parse(data);

      if (parsed.length > 0) {
        results.push(...parsed);
      }
    } catch (error) {
      console.log(`Error while fetching data for ${ticker}`);
      console.log(error);
    }
  }

  return results;
};

const MarketDataProvider = {
  getEODDataFromTo,
  getFundamentalsFrom,
};

export default MarketDataProvider;
