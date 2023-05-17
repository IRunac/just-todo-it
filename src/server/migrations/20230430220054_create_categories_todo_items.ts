import { Knex } from 'knex';
import { onUpdateTrigger } from '../helpers/db_helpers';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('categories_todo_items', table => {
    table.integer('todo_item_id').unsigned().references('id').inTable('todo_items');
    table.integer('category_id').unsigned().references('id').inTable('categories');
    table.boolean('owner').notNullable().defaultTo(true);
    table.primary(['todo_item_id', 'category_id']);
    table.timestamps(true, true);
  }).then(() => knex.raw(onUpdateTrigger('categories_todo_items')));
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTableIfExists('categories_todo_items');
};
