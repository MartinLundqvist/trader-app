import got, { OptionsOfJSONResponseBody } from 'got';
import {
  AUTHORIZATION,
  DAILY_URL,
  END_POINT_EOD,
  NEWS_URL,
} from './constants.js';
import { fromDateToString } from '../../utils/index.js';
import { MarketData, News, TiingoAPIResponse } from '../../types/index.js';
import { marketDataSchema, newsSchema } from '../../schemas/index.js';

const getMultipleEODDataFromTo = async (
  tickers: string[],
  dateFrom: Date,
  dateTo: Date
): Promise<MarketData> => {
  const tickerQueue = [...tickers];
  const concurrency = 100;
  const results: MarketData = [];

  const getNextTickerBatch = () => {
    if (tickerQueue.length === 0) return null;
    return tickerQueue.splice(0, concurrency);
  };

  const runPromisesBatch = async (tickerBatch: string[]) => {
    const promisesBatch = tickerBatch.map((ticker) =>
      getEODDataFromTo(ticker, dateFrom, dateTo)
    );
    return await Promise.all(promisesBatch);
  };

  let batch = getNextTickerBatch();
  let index = 1;

  while (batch) {
    console.log(`Running batch ${index} with ${batch.length} tickers...`);
    const batchResults = (await runPromisesBatch(batch)).flat();
    results.push(...batchResults);
    batch = getNextTickerBatch();
    index++;
  }

  return results;
};

const getEODDataFromTo = async (
  ticker: string,
  dateFrom: Date,
  dateTo: Date
): Promise<MarketData> => {
  const results: MarketData = [];

  console.log(`Fetching ticker data from tiingo for ${ticker}...`);

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
  return results;
};

const getLatestNews = async (ticker: string): Promise<News> => {
  console.log(`Fetching news from tiingo for ${ticker}...`);

  const result: News = [];

  try {
    const url = `${NEWS_URL}?tickers=${ticker}&${AUTHORIZATION}`;
    const options: OptionsOfJSONResponseBody = {
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await got<News>(url, options);

    const data = response?.body;

    if (!Array.isArray(data)) {
      throw new Error('No data returned from API');
    }

    let parsed = newsSchema.parse(data);

    if (parsed.length > 0) {
      result.push(...parsed);
    }
  } catch (error) {
    console.log(`Error while fetching news for ${ticker}`);
    console.log(error);
  }

  return result;
};

const MarketDataProvider = {
  getEODDataFromTo,
  getMultipleEODDataFromTo,
  getLatestNews,
};

// const example = {
//   id: 59655792,
//   publishedDate: '2023-11-18T06:20:43Z',
//   title: 'Cepton, Inc. (NASDAQ:CPTN) Short Interest Update',
//   url: 'https://www.thelincolnianonline.com/2023/11/18/cepton-inc-nasdaqcptn-short-interest-update.html',
//   description:
//     'Cepton, Inc. (NASDAQ:CPTN – Get Free Report) saw a large growth in short interest in the month of October. As of October 31st, there was short interest totalling 100,100 shares, a growth of 6.8% from the October 15th total of 93,700 shares. Approximately 2.1% of the shares of the company are sold short. Based on […]',
//   source: 'thelincolnianonline.com',
//   tags: [
//     'Auto',
//     'Call',
//     'Cepton',
//     'Communication Services',
//     'Cptn',
//     'Financial Services',
//     'Nasdaq:Cptn',
//     'Options',
//     'Put',
//     'Stock',
//     'Stocks',
//     'Tires',
//     'Truck',
//     'Unknown Sector',
//   ],
//   crawlDate: '2023-11-18T06:35:08.770051Z',
//   tickers: ['bk', 'call', 'cptn', 'ry'],
// };

export default MarketDataProvider;
