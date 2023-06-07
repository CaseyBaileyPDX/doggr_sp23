import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from '@mikro-orm/seeder';
import fs from "fs/promises";
import { UploadFileToMinio } from "../../plugins/minio.js";

export class MinioSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {

		// Cheeky throw dog.jpg into Minio
		const dogfile = await fs.readFile("./test/dog.jpg");
		const file = {
			file: dogfile,
			filename: "dog.jpg",
		}
		await UploadFileToMinio(file);
	}
}
