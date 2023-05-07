import { z } from 'zod';

// This is the shape of the data in the core application database table "marketdata_3500"
export const marketDatumSchema = z.object({
  id: z.optional(z.string()),
  symbol: z.string(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
  date: z.coerce.date(),
  split_factor: z.number(),
  adj_close: z.number(),
  adj_high: z.number(),
  adj_low: z.number(),
  adj_open: z.number(),
});

export const marketDataSchema = z.array(marketDatumSchema);

// This is the shape of the data in the core application datatabase table "tickerdata_3500"
export const tickerSchema = z.object({
  id: z.optional(z.string()),
  name: z.string(),
  market_cap: z.coerce.number(),
  symbol: z.string(),
  exchange: z.string(),
  asset_type: z.string(),
  price_currency: z.string(),
  start_date: z.nullable(z.coerce.date()),
  end_date: z.nullable(z.coerce.date()),
});

export const tickersSchema = z.array(tickerSchema);

// This is the shape of the data in the core application database table "strategyruns"
export const strategySignalSchema = z.object({
  id: z.optional(z.string()),
  // strategy_id: z.string(), //Not used yet!!
  name: z.string(),
  date: z.coerce.date(),
  symbol: z.string(),
  signal: z.string(),
  limit: z.nullable(z.number()),
  stop_loss: z.nullable(z.number()),
  take_profit: z.nullable(z.number()),
});

export const strategySignalsSchema = z.array(strategySignalSchema);

// Not used yet: This is the shape of the data in the core application database table "strategies"
export const strategySchema = z.object({
  id: z.optional(z.string()),
  name: z.string(),
  description_short: z.string(),
  description_long: z.string(),
});

export const strategiesSchema = z.array(strategySchema);

// Not used yet: This is the shape of the data returned when requesting the strategy run ouput for a ticker over a given timeframe
export const strategyTickerDatumSchema = z.object({
  id: z.optional(z.string()),
  symbol: z.string(),
  date: z.coerce.date(),
  Close: z.number(),
  Open: z.number(),
  High: z.number(),
  Low: z.number(),
  Volume: z.number(),
  BB_high: z.nullable(z.number()),
  BB_low: z.nullable(z.number()),
  SMA_slow: z.nullable(z.number()),
  SMA_fast: z.nullable(z.number()),
  Signal: z.string(),
  Limit: z.nullable(z.number()),
  Stop_loss: z.nullable(z.number()),
  Take_profit: z.nullable(z.number()),
});

export const strategyTickerDataSchema = z.array(strategyTickerDatumSchema);

// import { z } from 'zod';

// export const marketDatumSchema = z.object({
//   id: z.optional(z.string()),
//   symbol: z.string(),
//   open: z.number(),
//   high: z.number(),
//   low: z.number(),
//   close: z.number(),
//   volume: z.number(),
//   date: z.coerce.date(),
//   split_factor: z.number(),
//   adj_close: z.number(),
//   adj_high: z.number(),
//   adj_low: z.number(),
//   adj_open: z.number(),
// });

// export const marketDataSchema = z.array(marketDatumSchema);

// export const tickerSchema = z.object({
//   id: z.optional(z.string()),
//   name: z.string(),
//   market_cap: z.coerce.number(),
//   symbol: z.string(),
//   exchange: z.string(),
//   asset_type: z.string(),
//   price_currency: z.string(),
//   start_date: z.nullable(z.coerce.date()),
//   end_date: z.nullable(z.coerce.date()),
// });

// export const tickersSchema = z.array(tickerSchema);

// export const fundamentalSchema = z.object({
//   id: z.optional(z.string()),
//   date: z.coerce.date(),
//   market_cap: z.number(),
//   symbol: z.string(),
// });

// export const fundamentalsSchema = z.array(fundamentalSchema);

// export const strategySchema = z.object({
//   id: z.optional(z.string()),
//   name: z.string(),
//   date: z.coerce.date(),
//   symbol: z.string(),
//   signal: z.string(),
//   limit: z.nullable(z.number()),
//   stop_loss: z.nullable(z.number()),
//   take_profit: z.nullable(z.number()),
//   // graph: z.nullable(z.string()),
// });

// export const strategiesSchema = z.array(strategySchema);

// export const quoteSchema = z.object({
//   symbol: z.string(),
//   quote: z.object({
//     t: z.coerce.date(),
//     ax: z.string(),
//     ap: z.number(),
//     as: z.number(),
//     bx: z.string(),
//     bp: z.number(),
//     bs: z.number(),
//     c: z.array(z.string()),
//     z: z.string(),
//   }),
// });

// export const brokerAccountSchema = z.object({
//   id: z.string(),
//   account_number: z.string(),
//   currency: z.string(),
//   buying_power: z.number(),
//   cash: z.number(),
//   equity: z.number(),
//   long_market_value: z.number(),
//   short_market_value: z.number(),
//   balance_asof: z.coerce.date(),
//   initial_margin: z.number(),
//   maintenance_margin: z.number(),
//   multiplier: z.number(),
// });

// /*
// {
//   id: '09868dc0-aae1-496d-afd8-a581349e011e',
//   account_number: 'PA3W9OH36M79',
//   status: 'ACTIVE',
//   crypto_status: 'ACTIVE',
//   currency: 'USD',
//   buying_power: 199841.01,
//   regt_buying_power: 199841.01,
//   daytrading_buying_power: 0,
//   effective_buying_power: '199841.01',
//   non_marginable_buying_power: '99837.46',
//   bod_dtbp: '0',
//   cash: 99837.46,
//   accrued_fees: '0',
//   pending_transfer_in: '0',
//   portfolio_value: 100003.55,
//   pattern_day_trader: false,
//   trading_blocked: false,
//   transfers_blocked: false,
//   account_blocked: false,
//   created_at: 2023-03-31T11:26:03.983Z,
//   trade_suspended_by_user: false,
//   multiplier: 2,
//   shorting_enabled: true,
//   equity: 100003.55,
//   last_equity: 100002.36,
//   long_market_value: 166.09,
//   short_market_value: 0,
//   position_market_value: '166.09',
//   initial_margin: 83.045,
//   maintenance_margin: 49.827,
//   last_maintenance_margin: 49.47,
//   sma: 0,
//   daytrade_count: 0,
//   balance_asof: '2023-03-31',
//   crypto_tier: 1,
//   raw: [Function: raw]
// }

// */
