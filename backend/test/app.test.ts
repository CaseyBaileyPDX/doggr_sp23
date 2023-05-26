// @ts-nocheck
import * as dotenv from "dotenv";

dotenv.config();
import "chai/register-should.js"; // Using Should style
// @ts-ignore
import tap from "tap";
import { MikroORM, ISeedManager } from "@mikro-orm/core";
import { faker } from "@faker-js/faker";
import app from "../src/app.js";
import { UserRole } from "../src/db/entities/User.js";
import config from "../src/db/mikro-orm.config.js";
import { DatabaseSeeder } from "../src/db/seeders/DatabaseSeeder.js";

let orm: MikroORM;

tap.before(async () => {
	app.log.warn("Initializing database...");
	orm = await MikroORM.init(config);
	const seeder: ISeedManager = orm.getSeeder();
	app.log.warn("Refreshing database schema...");
	await orm.getSchemaGenerator()
		.refreshDatabase();
	app.log.warn("Database refreshed, seeding...");
	await seeder.seed(DatabaseSeeder);
	app.log.warn("Finished seeding.");
});

tap.teardown(async () => {
	await orm.close();
	await app.close();
});

void tap.test("List all users from /dbvoid tap.test", async () => {
	const response = await app.inject({
		method: "GET",
		url: "/dbTest"
	});

	response.statusCode.should.equal(200);
});

void tap.test("Creating a new user", async () => {
	const payload = {
		name: "void tap.testname",
		email: faker.internet.email(),
		password: "password",
		role: UserRole.USER,
		petType: "Dog"
	};

	const response = await app.inject({
		method: "POST",
		url: "/users",
		payload
	});

	response.statusCode.should.equal(200);
	response.payload.should.not.equal(payload);
	const resPayload = response.json();
	resPayload.email.should.equal(payload.email);
	resPayload.petType.should.equal("Dog");
});

void tap.test("Creating a new message", async () => {
	const payload = {
		sender_id: 1,
		receiver_id: 3,
		message: "Hi"
	};

	const response = await app.inject({
		method: "POST",
		url: "/messages",
		payload
	});

	response.statusCode.should.equal(200);
	response.payload.should.not.equal(payload);
	const resPayload = response.json();
	resPayload.message.should.equal(payload.message);
});

void tap.test("Reading messages sent to a specific user", async () => {
	const payload = {
		receiver_id: 3
	};

	const response = await app.inject({
		method: "SEARCH",
		url: "/messages/received",
		payload
	});

	response.statusCode.should.equal(200);
});

void tap.test("Reading messages sent BY a specific user", async () => {
	const payload = {
		sender_id: 1
	};

	const response = await app.inject({
		method: "SEARCH",
		url: "/messages/sent",
		payload
	});

	response.statusCode.should.equal(200);
});

void tap.test("Updating a sent message", async () => {
	const payload = {
		message_id: 1,
		message: "New message text"
	};

	const response = await app.inject({
		method: "PUT",
		url: "/messages",
		payload
	});

	response.statusCode.should.equal(200);
	const resPayload = response.json();
	resPayload.message.should.equal(payload.message);
});

void tap.test("Deleting a specific message", async () => {
	let payload = {
		my_id: 1,
		message_id: 5,
		password: "password"
	};

	let response = await app.inject({
		method: "DELETE",
		url: "/messages",
		payload
	});

	response.statusCode.should.equal(200);

	// ensure to check that my_id is validity checked
	payload = { ...payload, my_id: 1000000 };

	response = await app.inject({
		method: "DELETE",
		url: "/messages",
		payload
	});

	response.statusCode.should.equal(500);

	// ensure to check that "bad" passwords fail, too!
	payload = { ...payload, my_id: 1, password: "password2" };

	response = await app.inject({
		method: "DELETE",
		url: "/messages",
		payload
	});

	response.statusCode.should.equal(401);
});

void tap.test("Deleting all sent messages", async () => {
	const payload = {
		my_id: 1,
		password: "password"
	};

	const response = await app.inject({
		method: "DELETE",
		url: "/messages/all",
		payload
	});

	response.statusCode.should.equal(200);
});

void tap.test("Deleting all sent messages fails with incorrect password", async () => {
	const payload = {
		my_id: 3,
		password: "WRONG"
	};

	const response = await app.inject({
		method: "DELETE",
		url: "/messages/all",
		payload
	});

	console.log(response.payload);

	response.statusCode.should.equal(401);
});

void tap.test("Testing message bad words filter", async () => {
	const payload = {
		sender_id: 1,
		receiver_id: 2,
		message: "Hi you shit"
	};

	const response = await app.inject({
		method: "POST",
		url: "/messages",
		payload
	});

	response.statusCode.should.equal(500);
	response.payload.should.not.equal(payload);
	const resPayload = response.json();
	resPayload.message.should.equal("Bad words naughty list added.");
	resPayload.message.should.not.equal("Bad words naughty list added!");
});
