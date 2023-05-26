import { Migration } from "@mikro-orm/migrations";

export class Migration20230426224131 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table "match" ("owner_id" int not null, "matchee_id" int not null, "created_at" timestamptz(0) not null, constraint "match_pkey" primary key ("owner_id", "matchee_id"));'
		);

		this.addSql(
			'alter table "match" add constraint "match_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;'
		);
		this.addSql(
			'alter table "match" add constraint "match_matchee_id_foreign" foreign key ("matchee_id") references "users" ("id") on update cascade;'
		);

		this.addSql('alter table "users" drop column "is_matched";');
	}

	async down(): Promise<void> {
		this.addSql('drop table if exists "match" cascade;');

		this.addSql('alter table "users" add column "is_matched" boolean not null default false;');
	}
}
