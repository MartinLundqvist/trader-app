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
  })
);
