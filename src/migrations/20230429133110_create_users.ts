import { Knex } from 'knex';
import { onUpdateTrigger } from '../helpers/db_helpers';
import { UserRole } from '../entities/User';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('username');
    table.enu('role', Object.values(UserRole)).defaultTo(UserRole.USER);
    table.timestamps(true, true);
  }).then(() => knex.raw(onUpdateTrigger('users')));
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('users');
};
