import 'dotenv/config';
import { Configuration, Options } from '@mikro-orm/core';

const dbName = process.env.DB_NAME || 'todo';
const password = process.env.DB_PASSWORD || 'irunac';
const type = process.env.DB_TYPE as keyof typeof Configuration.PLATFORMS || 'postgresql';

const options: Options = {
  entities: ['./dist/server/entities'],
  entitiesTs: ['./src/server/entities'],
  dbName,
  password,
  type,
  allowGlobalContext: true
};

export default options;
