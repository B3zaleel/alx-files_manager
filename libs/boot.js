import { config } from 'dotenv';

const startServer = (api) => {
  const port = process.env.PORT || 5000;
  const env = process.env.npm_lifecycle_event || 'dev';

  config({ path: env.includes('test') ? '.env.test' : '.env' });
  api.listen(port, () => {
    console.log(`[${env}] API has started listening at port:${port}`);
  });
};

export default startServer;
