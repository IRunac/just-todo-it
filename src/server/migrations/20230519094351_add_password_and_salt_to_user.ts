import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.alterTable('users', table => {
    table.string('password').notNullable().defaultTo('password');
    table.string('salt').notNullable().defaultTo('salt');
  });
};

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.alterTable('users', table => {
    table.dropColumn('password');
    table.dropColumn('salt');
  });
};
