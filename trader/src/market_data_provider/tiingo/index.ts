import { MarketData, TiingoAPIResponse } from '../../types/index.js';
import got, { OptionsOfJSONResponseBody } from 'got';
import { AUTHORIZATION, BASE_URL, END_POINT_EOD } from './constants.js';
import { fromDateToString } from '../../utils/index.js';
import { marketDataSchema } from '../../schemas/index.js';

const getEODDataFromTo = async (
  tickers: string[],
  date_from: Date,
  date_to: Date
): Promise<MarketData> => {
  const results: MarketData = [];

  for (let ticker of tickers) {
    console.log(`Fetching data for ${ticker}...`);

    try {
      const url = `${BASE_URL}/${ticker}/${END_POINT_EOD}?${AUTHORIZATION}&startDate=${fromDateToString(
        date_from
      )}&endDate=${fromDateToString(date_to)}&format=json&resampleFreq=daily`;
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

const MarketDataProvider = {
  getEODDataFromTo,
};

export default MarketDataProvider;
