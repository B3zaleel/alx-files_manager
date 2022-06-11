import { config } from 'dotenv';

/**
 * Loads the appropriate environment variables for an event.
 */
const envLoader = () => {
  const env = process.env.npm_lifecycle_event || 'dev';

  config({ path: env.includes('test') ? '.env.test' : '.env' });
};

export default envLoader;
