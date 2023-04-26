import { Migration } from '@mikro-orm/migrations';

export class Migration20230425190331 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "username" varchar(255) not null, "role" text check ("role" in (\'admin\', \'user\')) not null);');

    this.addSql('create table "category" ("id" serial primary key, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "name" varchar(255) not null, "color" varchar(255) not null, "value" int not null, "max_value" int not null default 100, "user_id" int not null);');

    this.addSql('create table "board" ("id" serial primary key, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "type" text check ("type" in (\'daily\', \'weekly\', \'monthly\', \'yearly\')) not null, "user_id" int not null);');

    this.addSql('create table "todo_item" ("id" serial primary key, "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "name" varchar(255) not null, "status" text check ("status" in (\'todo\', \'in_progress\', \'done\')) not null default \'todo\', "completed_increment" int not null, "failed_increment" int not null, "user_id" int not null, "board_id" int not null);');

    this.addSql('create table "category_todo_items" ("category_id" int not null, "todo_item_id" int not null, constraint "category_todo_items_pkey" primary key ("category_id", "todo_item_id"));');

    this.addSql('alter table "category" add constraint "category_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "board" add constraint "board_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "todo_item" add constraint "todo_item_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "todo_item" add constraint "todo_item_board_id_foreign" foreign key ("board_id") references "board" ("id") on update cascade;');

    this.addSql('alter table "category_todo_items" add constraint "category_todo_items_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "category_todo_items" add constraint "category_todo_items_todo_item_id_foreign" foreign key ("todo_item_id") references "todo_item" ("id") on update cascade on delete cascade;');
  }

}
