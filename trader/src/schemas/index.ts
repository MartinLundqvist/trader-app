import { z } from 'zod';

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

export const fundamentalSchema = z.object({
  id: z.optional(z.string()),
  date: z.coerce.date(),
  market_cap: z.number(),
  symbol: z.string(),
});

export const fundamentalsSchema = z.array(fundamentalSchema);

export const strategyResponseSchema = z.array(
  z.object({
    id: z.optional(z.string()),
    date: z.coerce.date(),
    symbol: z.string(),
    signal: z.string(),
    limit: z.nullable(z.number()),
    graph: z.nullable(z.string()),
  })
);
