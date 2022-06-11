import { existsSync } from 'fs';

const startServer = (api) => {
  const env = process.env.npm_lifecycle_event || 'dev';
  if (existsSync('.env') || existsSync('.env.test')) {
    const dotenv = require('dotenv');
    dotenv.config({ path: env.includes('test') ? '.env.test' : '.env' });
  }
  const port = process.env.PORT || 5000;

  api.listen(port, () => {
    console.log(`[${env}] API has started listening at port:${port}`);
  });
};

export default startServer;
