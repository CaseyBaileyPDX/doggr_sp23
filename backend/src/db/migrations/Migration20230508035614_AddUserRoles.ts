import { Migration } from '@mikro-orm/migrations';

export class Migration20230508035614 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "role" text check ("role" in (\'Admin\', \'User\')) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop column "role";');
  }

}
