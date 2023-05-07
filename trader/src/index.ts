import express from 'express';
import cors from 'cors';
import { routes } from './routes/index.js';
import { config } from 'dotenv';
import StrategyDB from './database_provider/model_strategy.js';
config();

const PORT = Number(process.env.PORT) || 4001;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
