import { Collection, Entity, Enum, ManyToOne, OneToMany } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { TodoItem } from './TodoItem';
import { User } from './User';

export enum BoardType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

@Entity()
export class Board extends BaseEntity {
  @Enum(() => BoardType)
    type!: BoardType;

  @ManyToOne(() => User)
    user!: User;

  @OneToMany(() => TodoItem, todoItem => todoItem.board)
    todo_items = new Collection<TodoItem>(this);

  // constructor(type: BoardType) {
  //     super()
  //     this.type = type;
  // }
}
