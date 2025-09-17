import { Config, defineConfig } from 'drizzle-kit';
import 'dotenv/config';

const dbURL = process.env['DATABASE_URL'];
if (!dbURL) {
  throw new Error('DATABASE_URL is not defined on .env file');
}

const config: Config = {
  out: './drizzle',
  schema: './src/**/entities/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbURL,
  },
  driver: 'pglite',
};

export default defineConfig(config);
