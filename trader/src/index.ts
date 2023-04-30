import express from 'express';
import { routes } from './routes/index.js';
import { config } from 'dotenv';
config();

const PORT = Number(process.env.PORT) || 4001;

const app = express();

app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
