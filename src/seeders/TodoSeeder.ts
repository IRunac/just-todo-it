import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User, UserRole } from '../entities/User';

export class TodoSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    const user = em.create(User, {
      username: 'irunac',
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}