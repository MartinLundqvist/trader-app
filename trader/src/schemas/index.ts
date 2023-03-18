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
  split_factor: z.number(), //TODO: Testing only
  adj_close: z.number(), //TODO: Testing only
  adj_high: z.number(), //TODO: Testing only
  adj_low: z.number(), //TODO: Testing only
  adj_open: z.number(), //TODO: Testing only
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
