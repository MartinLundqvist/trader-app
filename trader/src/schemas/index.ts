import { z } from 'zod';

export const marketDataSchema = z.array(
  z.object({
    symbol: z.string(),
    open: z.number(),
    high: z.number(),
    low: z.number(),
    close: z.number(),
    volume: z.number(),
    exchange: z.string(),
    date: z.coerce.date(),
    split_factor: z.optional(z.number()), //TODO: Testing only
    adj_close: z.optional(z.nullable(z.number())), //TODO: Testing only
  })
);
