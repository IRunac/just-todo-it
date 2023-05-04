import { Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { TodoItem } from './TodoItem';
import { User } from './User';

@Entity()
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

  @ManyToMany(() => TodoItem, 'categories', { owner: true })
    todo_items = new Collection<TodoItem>(this);

  // constructor(name: string, color: string, value: number, max_value: number) {
  //     super()
  //     this.name = name;
  //     this.color = color;
  //     this.value = value;
  //     this.max_value = max_value;
  // }
}
