import { Migration } from '@mikro-orm/migrations';

export class Migration20230508034212 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "deleted_at" timestamptz(0) null;');

    this.addSql('alter table "message" add column "deleted_at" timestamptz(0) null;');

    this.addSql('alter table "match" add column "deleted_at" timestamptz(0) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop column "deleted_at";');

    this.addSql('alter table "message" drop column "deleted_at";');

    this.addSql('alter table "match" drop column "deleted_at";');
  }

}
