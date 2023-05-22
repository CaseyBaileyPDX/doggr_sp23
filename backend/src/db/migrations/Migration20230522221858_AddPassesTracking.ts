import { Migration } from '@mikro-orm/migrations';

export class Migration20230522221858 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "pass" ("owner_id" int not null, "passee_id" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, constraint "pass_pkey" primary key ("owner_id", "passee_id"));');

    this.addSql('alter table "pass" add constraint "pass_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "pass" add constraint "pass_passee_id_foreign" foreign key ("passee_id") references "users" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "pass" cascade;');
  }

}
