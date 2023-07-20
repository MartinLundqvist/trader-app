import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import proxy from 'express-http-proxy';
import { config } from 'dotenv';

const envString =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';

console.log(`Loading configuration from ${envString}`);

config({ path: envString, debug: true, override: true });

const app = express();
const port = process.env.PORT || 3000;

// In order to access the internal Docker container network during production, we need to use a proxy server.
// This is because I do not want to expose the trader, databsae or strategies services to the outside world.
const BACK_END_URL = process.env.BACK_END_URL || 'http://localhost:4001/api';

console.log(`Proxying API requests to ${BACK_END_URL}`);

app.all('*', (req, res, next) => {
  console.log(`Request received: ${req.method} ${req.path}`);
  next();
});

app.all('/api/*', (req, res, next) => {
  console.log(`Proxying request from ${req.ip}`);

  proxy(BACK_END_URL)(req, res, next);
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, '../')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
