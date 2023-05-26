import { TSMigrationGenerator } from "@mikro-orm/migrations";
import dotenv from "dotenv";
dotenv.config();
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { defineConfig } from "@mikro-orm/postgresql";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.join(__dirname, "seeders");
const entitiesJSPath = path.join(__dirname, "..", "..", "build", "db", "entities");
const entitiesTSPath = path.join(__dirname, "entities");
const migrationsJSPath = path.join(__dirname, "..", "..", "build", "db", "migrations");
const migrationsTSPath = path.join(__dirname, "migrations");

export default defineConfig({
	entities: [entitiesJSPath],
	entitiesTs: [entitiesTSPath],
	tsNode: true,
	dbName: process.env.DB_NAME,
	port: Number(process.env.DB_PORT),
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	baseDir: "../",
	// Allows our Typescript decorators to serve as entity schemas https://mikro-orm.io/docs/metadata-providers
	metadataProvider: TsMorphMetadataProvider,

	seeder: {
		pathTs: seedPath,
		defaultSeeder: "DatabaseSeeder",
		glob: "!(*.d).{js,ts}", // how to match seeder files (all .js and .ts files, but not .d.ts)
		emit: "ts", // seeder generation mode
	},

	migrations: {
		tableName: "mikro_orm_migrations", // name of database table with log of executed transactions
		path: migrationsJSPath, // path to the folder with migrations
		pathTs: migrationsTSPath, // path to the folder with TS migrations
		glob: "!(*.d).{js,ts}", // how to match migration files (all .js and .ts files, but not .d.ts)
		transactional: true, // wrap each migration in a transaction
		disableForeignKeys: false, // wrap statements with `set foreign_key_checks = 0` or equivalent
		allOrNothing: true, // wrap all migrations in master transaction
		dropTables: true, // allow to disable table dropping
		safe: false, // allow to disable table and column dropping
		snapshot: true, // save snapshot when creating new migrations
		emit: "ts", // migration generation mode
		generator: TSMigrationGenerator, // migration generator, e.g. to allow custom formatting

		fileName: (timestamp: string, name?: string) => {
			// force user to provide the name, otherwise we would end up with `Migration20230421212713_undefined`
			if (!name) {
				throw new Error("Specify migration name via `mikro-orm migration:create --name=...`");
			}

			return `Migration${timestamp}_${name}`;
		},
	},
});
