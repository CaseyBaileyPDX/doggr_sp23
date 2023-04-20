import dotenv from "dotenv";
dotenv.config();
import {TsMorphMetadataProvider} from "@mikro-orm/reflection";
import {defineConfig} from "@mikro-orm/postgresql";

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.join(__dirname, "seeders");
const entitiesJSPath = path.join(__dirname, "..", "..", "build", "db", "entities");
const entitiesTSPath = path.join(__dirname, "entities");


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
		defaultSeeder: 'DatabaseSeeder',
		glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
		emit: 'ts', // seeder generation mode
	}
});
