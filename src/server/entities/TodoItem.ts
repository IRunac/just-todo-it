import { Cascade, Collection, Entity, Enum, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Board } from './Board';
import { Category } from './Category';
import { User } from './User';

export enum ItemStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Entity({ tableName: 'todo_items' })
export class TodoItem extends BaseEntity {
  @Property()
    name!: string;

  @Enum(() => ItemStatus)
    status: ItemStatus = ItemStatus.TODO;

  @Property()
    completed_increment!: number;

  @Property()
    failed_increment!: number;

  @ManyToOne(() => User)
    user!: User;

  @ManyToOne(() => Board)
    board!: Board;

  @ManyToMany(() => Category, category => category.todo_items, { cascade: [Cascade.ALL] })
    categories = new Collection<Category>(this);
}
