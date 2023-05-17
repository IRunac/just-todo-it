import { ItemStatus } from '../entities/TodoItem';
import { Knex } from 'knex';
import { onUpdateTrigger } from '../helpers/db_helpers';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('todo_items', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.enum('status', Object.values(ItemStatus)).notNullable().defaultTo(ItemStatus.TODO);
    table.integer('completed_increment').notNullable();
    table.integer('failed_increment').notNullable();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('board_id').unsigned().notNullable().references('id').inTable('boards');
    table.timestamps(true, true);
  }).then(() => knex.raw(onUpdateTrigger('todo_items')));
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('todo_items');
};
