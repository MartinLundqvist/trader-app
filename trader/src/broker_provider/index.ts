import { quoteSchema } from '../schemas/index.js';
import { Quote } from '../types/index.js';
import { AlpacaClient } from './alpaca/index.js';
import { config } from 'dotenv';
config();

const options = {
  credentials: {
    key: process.env.API_KEY_ALPACA || '',
    secret: process.env.API_SECRET_ALPACA || '',
    paper: true,
  },
  rate_limit: true,
};

const Trader = new AlpacaClient(options);

// const getLatestQuote = async (symbol: string): Promise<Quote | null> => {
//   try {
//     const result = await trader.getLastQuote_v2({ symbol });
//     let parsed = quoteSchema.parse(result);
//     return parsed;
//   } catch (err) {
//     console.log('Error getting latest quote', symbol);
//     console.log(err);
//     return null;
//   }
// };

// TODO: Put these into schemas
// const placeOrder = trader.placeOrder;
// const getAccount = trader.getAccount;
// const getOrders = trader.getOrders;

export default Trader;
