import { Knex } from 'knex';
import { UserRole } from '../entities/User';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  // await knex("users").del();

  // Inserts seed entries
  await knex('users').insert([
    { username: 'mirko', role: UserRole.USER },
    { username: 'slavko', role: UserRole.ADMIN }
  ]);
}
