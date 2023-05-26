import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User, UserRole } from "../entities/User.js";
import bcrypt from "bcrypt";


export class UserSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {

		const hashedPw = await bcrypt.hash("password", 10);

		// https://mikro-orm.io/docs/seeding#shared-context
		context.user1 = em.create(User, {
			name: "Spot",
			email: "email@email.com",
			password: hashedPw,
			petType: "Dog",
			imgUri: "dog.jpg",
			role: UserRole.ADMIN,
		});

		context.user2 = em.create(User, {
			name: "Dogbert",
			email: "email2@email.com",
			password: hashedPw,
			petType: "Dog",
			imgUri: "dog.jpg",
			role: UserRole.USER,
		});

		context.user3 = em.create(User, {
			name: "Doglord",
			email: "email3@email.com",
			password: hashedPw,
			petType: "Dog",
			imgUri: "dog.jpg",
			role: UserRole.USER,
		});

		context.user4 = em.create(User, {
			name: "NotaDog",
			email: "email4@email.com",
			password: hashedPw,
			petType: "Cat",
			imgUri: "dog.jpg",
			role: UserRole.USER,
		});
	}
}
