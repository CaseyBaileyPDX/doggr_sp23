import { Migration } from '@mikro-orm/migrations';

export class Migration20230522224730 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "img_uri" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop column "img_uri";');
  }

}
