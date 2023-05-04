import { BoardType } from '../entities/Board';
import { Knex } from 'knex';
import { onUpdateTrigger } from '../helpers/db_helpers';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('boards', table => {
    table.increments('id').primary();
    table.enu('type', Object.values(BoardType)).notNullable();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
  }).then(() => knex.raw(onUpdateTrigger('boards')));
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('boards');
};
