import 'dotenv/config';
import { Configuration, Options } from '@mikro-orm/core';

const dbName = process.env.DB_NAME || 'todo';
const password = process.env.DB_PASSWORD || 'irunac';
const type = process.env.DB_TYPE as keyof typeof Configuration.PLATFORMS || 'postgresql';

const options: Options = {
  entities: ['../dist/server/entities'],
  // entitiesTs: ['./entities'],
  entitiesTs: ['./src/server/entities'],
  dbName,
  password,
  type,
  allowGlobalContext: true
  // migrations: {
  //   path: './dist/migrations', // path to the folder with migrations
  //   pathTs: './server/migrations', // path to the folder with TS migrations (if used, we should put path to compiled files in `path`)
  //   glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
  //   transactional: true, // wrap each migration in a transaction
  //   disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
  //   allOrNothing: true, // wrap all migrations in master transaction
  //   dropTables: true, // allow to disable table dropping
  //   safe: false, // allow to disable table and column dropping
  //   snapshot: false, // save snapshot when creating new migrations
  //   emit: 'ts' // migration generation mode
  // },
  // seeder: {
  //   path: './dist/seeders', // path to the folder with seeders
  //   pathTs: './server/seeders', // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
  //   defaultSeeder: 'TodoSeeder', // default seeder class name
  //   emit: 'ts' // seeder generation mode
  // }
};

export default options;
