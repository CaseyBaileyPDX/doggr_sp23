import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Match } from "./db/entities/Match.js";
import { Message } from "./db/entities/Message.js";
import { User } from "./db/entities/User.js";
import { ICreateMessage, ICreateUsersBody } from "./types.js";

const adminPassword = process.env.password;

async function DoggrRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}

	app.get("/hello", async (_request: FastifyRequest, _reply: FastifyReply) => {
		return "hello";
	});

	app.get("/dbTest", async (request: FastifyRequest, _reply: FastifyReply) => {
		return request.em.find(User, {});
	});

	// User CRUD
	// C
	app.post<{ Body: ICreateUsersBody }>("/users", async (req, reply) => {
		const { name, email, petType } = req.body;

		try {
			const newUser = await req.em.create(User, {
				name,
				email,
				petType,
			});

			await req.em.flush();
			return reply.send(newUser);
		} catch (err) {
			app.log.error("Failed to create new user", err.message);
			return reply.status(500).send({ message: err.message });
		}
	});

	//READ
	app.search("/users", async (req, reply) => {
		const { email } = req.body;

		try {
			const theUser = await req.em.findOne(User, { email });
			app.log.info(theUser);
			reply.send(theUser);
		} catch (err) {
			app.log.error(err);
			reply.status(500).send(err);
		}
	});

	// UPDATE
	app.put<{ Body: ICreateUsersBody }>("/users", async (req, reply) => {
		const { name, email, petType } = req.body;

		const userToChange = await req.em.findOne(User, { email });
		userToChange.name = name;
		userToChange.petType = petType;

		// Reminder -- this is how we persist our JS object changes to the database itself
		await req.em.flush();
		app.log.info(userToChange);
		reply.send(userToChange);
	});

	// DELETE
	app.delete<{ Body: { email, password } }>("/users", async (req, reply) => {
		const { email, password } = req.body;

		if (adminPassword !== password) {
			return reply.status(401).send();
		}

		try {
			const theUser = await req.em.findOne(User, { email });

			await req.em.remove(theUser).flush();
			app.log.info(theUser);
			return reply.send(theUser);
		} catch (err) {
			app.log.error(err);
			return reply.status(500).send(err);
		}
	});

	// CREATE MATCH ROUTE
	app.post<{ Body: { email: string; matchee_email: string } }>("/match", async (req, reply) => {
		const { email, matchee_email } = req.body;

		try {
			// make sure that the matchee exists & get their user account
			const matchee = await req.em.findOne(User, { email: matchee_email });
			// do the same for the matcher/owner
			const owner = await req.em.findOne(User, { email });

			//create a new match between them
			const newMatch = await req.em.create(Match, {
				owner,
				matchee,
			});

			//persist it to the database
			await req.em.flush();
			// send the match back to the user
			return reply.send(newMatch);
		} catch (err) {
			app.log.error(err);
			return reply.status(500).send(err);
		}
	});

	/////////////////////////////////////////////////////////////////////////////
	// HOMEWORK 1
	/////////////////////////////////////////////////////////////////////////////

	/* This is where we have to be careful with the difference in a full entity
	 vs a reference.  References are a Mikro-orm optimization that lets us avoid database
	 queries when all we need from something is its id.  That is the case here:
	 we only *need* references to these Users, not their entire data.  We don't actually care
	 about any of their data except their ID, so we would like to use references here.
	 Unfortunately, we're currently tracking users by their email address, not their database id!

	 This is a situation where you have a choice to make.  Either we refactor a bit
	 now to start using `id` everywhere rather than email address (since THAT is the field
	 that links tables together in our database, not email...or we give up forever
	 on enabling LOTS of optimizations.  My personal choice is to refactor, so
	 the final code solution I merge into our official Doggr repo will be one
	 that fixes this problem.  We'll do it the simpler way for this solution
	 and take what we need from the database at any cost.
	 */
	app.post<{ Body: ICreateMessage }>("/messages", async (req, reply) => {
		const { sender, receiver, message } = req.body;

		// Check for bad words
		let badword = undefined;
		message.split(" ").forEach( (word) => {
			if (app.badwords.has(word)) {
				badword = word;
			}
		});

		if (badword !== undefined) {
			return reply.status(500).send({ message: "Bad words naughty list added."});
		}

		try {
			// This is a pure convenience so we don't have to keep passing User to req.em.find
			const userRepository = req.em.getRepository(User);

			//Find our two users, so we can link them into our new message
			const senderEntity = await userRepository.findOneOrFail({ email: sender });
			const receiverEntity = await userRepository.findOneOrFail({ email: receiver });

			// Create the new message
			const newMessage = await req.em.create(Message, {
				sender: senderEntity,
				receiver: receiverEntity,
				message,
			});
			// Send our changes to the database
			await req.em.flush();

			// Let the user know everything went fine
			return reply.send(newMessage);
		} catch (err) {
			app.log.error("Failed to create new message", err.message);
			return reply.status(500).send({ message: err.message });
		}
	});

	app.search<{Body: { receiver: string}}>("/messages/received", async (req, reply) => {
		const { receiver } = req.body;

		try {
			const receiverEntity = await req.em.findOneOrFail(User, { email: receiver });
			const messages = await req.em.find(Message, { receiver: receiverEntity });
			return reply.send(messages);
		} catch (err) {
			app.log.error("Failed to find received message", err.message);
			return reply.status(500).send({ message: err.message });
		}
	});

	app.search<{Body: { sender: string}}>("/messages/sent", async (req, reply) => {
		const { sender } = req.body;

		try {
			const senderEntity = await req.em.findOneOrFail(User, { email: sender });
			const messages = await req.em.find(Message, { sender: senderEntity });
			return reply.send(messages);
		} catch (err) {
			app.log.error("Failed to find sent messages", err.message);
			return reply.status(500).send({ message: err.message });
		}
	});

	app.put<{Body: { messageId: string, message: string }}>("/messages", async (req, reply) => {
		const { messageId, message } = req.body;

		try {
			const msg = await req.em.findOneOrFail(Message, { id: Number(messageId) });
			msg.message = message;
			await req.em.persistAndFlush(msg);
			return reply.send(msg);
		} catch (err) {
			app.log.error("Failed to update message", err.message);
			return reply.status(500).send({ message: err.message });
		}
	});

	app.delete<{Body: { messageId: string, password:string }}>("/messages", async (req, reply) => {
		const { messageId, password } = req.body;

		if (adminPassword !== password) {
			return reply.status(401).send();
		}

		try {
			const msgToDelete = await req.em.findOneOrFail(Message, {id: Number(messageId)});
			await req.em.removeAndFlush(msgToDelete);
			return reply.send();

		} catch (err) {
			app.log.error(`Failed to delete message with ID: ${messageId} - `, err.message);
			return reply.status(500).send({ message: err.message });
		}

	});

	app.delete<{Body: { sender: string, password:string }}>("/messages/all", async (req, reply) => {
		const { sender, password } = req.body;

		if (adminPassword !== password) {
			return reply.status(401).send();
		}

		try {
			const senderEntity = await req.em.findOneOrFail(User, {email: sender})
			const msgRepo = req.em.getRepository(Message);
			const messagesToDelete = await msgRepo.find({ sender: senderEntity })

			await msgRepo.removeAndFlush(messagesToDelete);

			return reply.send();

		} catch (err) {
			app.log.error(`Failed to delete all messages `, err.message);
			return reply.status(500).send({ message: err.message });
		}
	});
}

export default DoggrRoutes;
