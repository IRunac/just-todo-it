import { Knex } from 'knex';
import { onUpdateTrigger } from '../helpers/db_helpers';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('categories', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('color').notNullable();
    table.integer('value').notNullable();
    table.integer('max_value').notNullable().defaultTo(100);
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  }).then(() => knex.raw(onUpdateTrigger('categories')));
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('categories');
};
