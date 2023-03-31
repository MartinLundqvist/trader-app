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

export default new AlpacaClient(options);
