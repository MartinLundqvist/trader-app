// import { z } from 'zod';
// import {
//   fundamentalSchema,
//   fundamentalsSchema,
//   marketDataSchema,
//   marketDatumSchema,
//   tickerSchema,
//   tickersSchema,
//   strategiesSchema,
//   strategySchema,
//   quoteSchema,
// } from '../schemas/index.js';

// export type MarketData = z.infer<typeof marketDataSchema>;
// export type MarketDatum = z.infer<typeof marketDatumSchema>;
// export type Ticker = z.infer<typeof tickerSchema>;
// export type Tickers = z.infer<typeof tickersSchema>;
// export type Fundamental = z.infer<typeof fundamentalSchema>;
// export type Fundamentals = z.infer<typeof fundamentalsSchema>;
// export type Strategies = z.infer<typeof strategiesSchema>;
// export type Strategy = z.infer<typeof strategySchema>;
// export type Quote = z.infer<typeof quoteSchema>;

import {
  marketDatumSchema,
  marketDataSchema,
  tickerSchema,
  tickersSchema,
  strategySignalSchema,
  strategySignalsSchema,
  strategySchema,
  strategiesSchema,
  strategyTickerDatumSchema,
  strategyTickerDataSchema,
  marketDataInformationSchema,
} from '../schemas/index.js';

import { z } from 'zod';

export type MarketDatum = z.infer<typeof marketDatumSchema>;
export type MarketData = z.infer<typeof marketDataSchema>;
export type Ticker = z.infer<typeof tickerSchema>;
export type Tickers = z.infer<typeof tickersSchema>;
export type MarketDataInformation = z.infer<typeof marketDataInformationSchema>;
export type StrategySignal = z.infer<typeof strategySignalSchema>;
export type StrategySignals = z.infer<typeof strategySignalsSchema>;
export type Strategy = z.infer<typeof strategySchema>;
export type Strategies = z.infer<typeof strategiesSchema>;
export type StrategyTickerDatum = z.infer<typeof strategyTickerDatumSchema>;
export type StrategyTickerData = z.infer<typeof strategyTickerDataSchema>;

// Generated by https://quicktype.io

export interface MarketstackAPIResponse {
  pagination: Pagination;
  data: Datum[];
}

interface Datum {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adj_high: number;
  adj_low: number;
  adj_close: number;
  adj_open: number;
  adj_volume: number;
  split_factor: number;
  dividend: number;
  symbol: string;
  exchange: string;
  date: string;
}

interface Pagination {
  limit: number;
  offset: number;
  count: number;
  total: number;
}

// Generated by https://quicktype.io

export interface TiingoAPIResponse {
  date: string;
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  adjClose: number;
  adjHigh: number;
  adjLow: number;
  adjOpen: number;
  adjVolume: number;
  divCash: number;
  splitFactor: number;
}
[];
