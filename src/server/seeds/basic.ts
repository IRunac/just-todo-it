import crypto from 'crypto';
import { Knex } from 'knex';
import { UserRole } from '../entities/User';

export async function seed(knex: Knex): Promise<void> {
  await knex('categories_todo_items').del();
  await knex('users').del();
  const usernames = ['mirko', 'slavko', 'tonko', 'vinko'];
  for (const username of usernames) {
    const salt = crypto.randomBytes(16).toString('hex');
    const password = crypto.pbkdf2Sync(username, salt, 310000, 32, 'sha256').toString('hex');
    await knex('users').insert({
      username,
      role: username === 'mirko' ? UserRole.ADMIN : UserRole.USER,
      salt,
      password
    });
  }
}
