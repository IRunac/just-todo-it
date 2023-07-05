import { Cascade, Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { TodoItem } from './TodoItem';
import { User } from './User';

@Entity({ tableName: 'categories' })
export class Category extends BaseEntity {
  @Property()
    name!: string;

  @Property()
    color!: string;

  @Property()
    value!: number;

  @Property()
    max_value: number = 100;

  @ManyToOne(() => User)
    user!: User;

  @ManyToMany(() => TodoItem, 'categories', { owner: true, cascade: [Cascade.ALL] })
    todo_items = new Collection<TodoItem>(this);
}
