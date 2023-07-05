import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.alterTable('categories_todo_items', table => {
    table.dropForeign(['category_id']);
    table.dropForeign(['todo_item_id']);
    table.foreign('category_id').references('categories.id').onDelete('CASCADE');
    table.foreign('todo_item_id').references('todo_items.id').onDelete('CASCADE');
  });
};

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.alterTable('categories_todo_items', table => {
    table.dropForeign(['category_id']);
    table.dropForeign(['todo_item_id']);
    table.foreign('category_id').references('categories.id');
    table.foreign('todo_item_id').references('todo_items.id');
  });
};
