import { Cascade, Collection, Entity, Enum, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { Board } from './Board';
import { Category } from './Category';

export enum ItemStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    DONE = 'done',
};

@Entity()
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

    @ManyToMany(() => Category, category => category.todo_items)
    categories = new Collection<Category>(this);

    // constructor(name: string, completed_increment: number, failed_increment: number) {
    //     super()
    //     this.name = name;
    //     this.completed_increment = completed_increment;
    //     this.failed_increment = failed_increment;
    // }
}
