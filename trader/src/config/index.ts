import { config } from 'dotenv';

const envString = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';

const getConfiguration = () => {
  console.log(`Loading configuration from ${envString}`);

  config({ path: envString, debug: true, override: true });
};

export default getConfiguration;
