import { Migration } from '@mikro-orm/migrations';

export class Migration20230508052213 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "message" drop constraint "message_sender_id_foreign";');
    this.addSql('alter table "message" drop constraint "message_receiver_id_foreign";');

    this.addSql('alter table "message" alter column "sender_id" type int using ("sender_id"::int);');
    this.addSql('alter table "message" alter column "sender_id" set not null;');
    this.addSql('alter table "message" alter column "receiver_id" type int using ("receiver_id"::int);');
    this.addSql('alter table "message" alter column "receiver_id" set not null;');
    this.addSql('alter table "message" add constraint "message_sender_id_foreign" foreign key ("sender_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "message" add constraint "message_receiver_id_foreign" foreign key ("receiver_id") references "users" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "message" drop constraint "message_sender_id_foreign";');
    this.addSql('alter table "message" drop constraint "message_receiver_id_foreign";');

    this.addSql('alter table "message" alter column "sender_id" type int using ("sender_id"::int);');
    this.addSql('alter table "message" alter column "sender_id" drop not null;');
    this.addSql('alter table "message" alter column "receiver_id" type int using ("receiver_id"::int);');
    this.addSql('alter table "message" alter column "receiver_id" drop not null;');
    this.addSql('alter table "message" add constraint "message_sender_id_foreign" foreign key ("sender_id") references "users" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "message" add constraint "message_receiver_id_foreign" foreign key ("receiver_id") references "users" ("id") on update cascade on delete cascade;');
  }

}
