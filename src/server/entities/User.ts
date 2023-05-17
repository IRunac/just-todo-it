import { Cascade, Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Board } from './Board';
import { Category } from './Category';
import { TodoItem } from './TodoItem';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity({ tableName: 'users' })
export class User extends BaseEntity {
  @Property()
    username!: string;

  @Enum(() => UserRole)
    role!: UserRole;

  @OneToMany(() => Board, board => board.user, { cascade: [Cascade.ALL] })
    boards = new Collection<Board>(this);

  @OneToMany(() => Category, category => category.user, { cascade: [Cascade.ALL] })
    categories = new Collection<Category>(this);

  @OneToMany(() => TodoItem, todoItem => todoItem.user, { cascade: [Cascade.ALL] })
    todo_items = new Collection<TodoItem>(this);

  // constructor(username: string, role: UserRole) {
  //     super()
  //     this.username = username;
  //     this.role = role;
  // }
}
