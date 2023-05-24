import bcrypt from "bcrypt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { SOFT_DELETABLE_FILTER } from "mikro-orm-soft-delete";
import { User, UserRole } from "../db/entities/User.js";
import { UploadFileToMinio } from "../plugins/minio.js";
import { ICreateUsersBody, IUpdateUsersBody } from "../types.js";

export function UserRoutesInit(app: FastifyInstance) {
	// Route that returns all users, soft deleted and not
	app.get("/dbTest", async (request: FastifyRequest, _reply: FastifyReply) => {
		return request.em.find(User, {}, { filters: { [SOFT_DELETABLE_FILTER]: false } });
	});

	// Route that returns all users who ARE NOT SOFT DELETED
	app.get("/users",
		{ onRequest: [app.auth]},
		async (req, reply) => {
		try {
			const theUser = await req.em.find(User, {});
			reply.send(theUser);
		} catch (err) {
			reply.status(500).send(err);
		}
	});

	// User CRUD
	// Refactor note - We DO use email still for creation!  We can't know the ID yet
	app.post<{ Body: ICreateUsersBody }>("/users", async (req, reply) => {

		try {
			const data = await req.file();


			const body = Object.fromEntries(
				// @ts-ignore
				Object.keys(data.fields).map( (key) => [key, data.fields[key].value])
			);
			const { name, email, password, petType } = body;
			await UploadFileToMinio(data);

			const hashedPw = await bcrypt.hash(password, 10);
			const newUser = await req.em.create(User, {
				name,
				email,
				password: hashedPw,
				petType,
				imgUri: data.filename,
				// We'll only create Admins manually!
				role: UserRole.USER
			});

			await req.em.flush();
			return reply.send(newUser);
		} catch (err) {
			return reply.status(500).send({ message: err.message });
		}
	});

	//READ
	app.search("/users", async (req, reply) => {
		const { id } = req.body;

		try {
			const theUser = await req.em.findOneOrFail(User, id, {strict: true});
			reply.send(theUser);
		} catch (err) {
			reply.status(500).send(err);
		}
	});

	// UPDATE
	app.put<{ Body: IUpdateUsersBody }>("/users", async (req, reply) => {
		const { name, id, petType } = req.body;

		const userToChange = await req.em.findOneOrFail(User, id, {strict: true});
		userToChange.name = name;
		userToChange.petType = petType;

		// Reminder -- this is how we persist our JS object changes to the database itself
		await req.em.flush();
		reply.send(userToChange);
	});

	// DELETE
	app.delete<{ Body: { my_id: number; id_to_delete: number, password: string } }>("/users", async (req, reply) => {
		const { my_id, id_to_delete, password } = req.body;

		try {
			// Authenticate my user's role
			const me = await req.em.findOneOrFail(User, my_id, {strict: true});
			// Check passwords match
			if (me.password !== password) {
				return reply.status(401).send();
			}

			// Make sure the requester is an Admin
			if (me.role === UserRole.USER) {
				return reply.status(401).send({ "message": "You are not an admin!"})
			}

			const theUserToDelete = await req.em.findOneOrFail(User, id_to_delete, {strict: true});

			//Make sure the to-be-deleted user isn't an admin
			if (theUserToDelete.role === UserRole.ADMIN) {
				return reply.status(401).send({ "message": "You do not have enough privileges to delete an Admin!"})
			}

			await req.em.remove(theUserToDelete).flush();
			return reply.send(theUserToDelete);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});

	/*Login
	1) User attempts to create a new account and enters username and password into some User Create page
	2) Server takes password, salt/hashes/encrypts, store the resulting password in our Users table in the database
	3) User attempts to login to previously created account and enters username and password into a Login page
	4) Server retrieves the user from our database, then uses bcrypt's compare function to compare it to the user's entered password
	5) Server creates JWT token and passes it back to the client.
	6) Frontend then sends JWT in all subsequent requests, NEVER their actual password again!  Thanks to the magic
	   of JWTs, we can thusly avoid EVER retrieving the user's password from a database again.
	 */
	app.post<{
		Body: {
			email: string,
			password: string,
		}
	}>("/login", async (req, reply) => {
		const { email, password } = req.body;

		try {
			const theUser = await req.em.findOneOrFail(User, {email}, { strict: true });

			const hashCompare = await bcrypt.compare(password, theUser.password);
			if (hashCompare) {
				const userId = theUser.id;
				const token = app.jwt.sign({ userId });

				reply.send({ token });
			} else {
				app.log.info(`Password validation failed -- ${password} vs ${theUser.password}`);
				reply.status(401)
					.send("Incorrect Password");
			}
		} catch (err) {
			reply.status(500)
				.send(err);
		}
	});

	app.get("/profile", async(req, reply) => {

		const userRepo = req.em.getRepository(User);
		const totalCount = await userRepo.count();
		const randomOffset = Math.floor(Math.random() * totalCount);
		const randomEntity = await userRepo.findOne({}, {offset: randomOffset});
		reply.send(randomEntity);
	});
}
