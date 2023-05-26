import { FastifyInstance } from "fastify";
import { Message } from "../db/entities/Message.js";
import { User } from "../db/entities/User.js";
import { ICreateMessage } from "../types.js";


export function MessageRoutesInit(app: FastifyInstance) {
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
		const { sender_id, receiver_id, message } = req.body;

		// Check for bad words - We could move this into its own utility service, but it's only used here for now
		// No reason to prematurely refactor things we might never need again
		let badword = undefined;
		message.split(" ").forEach((word) => {
			if (app.badwords.has(word)) {
				badword = word;
			}
		});

		if (badword !== undefined) {
			return reply.status(500).send({ message: "Bad words naughty list added." });
		}

		try {
			// This is a pure convenience so we don't have to keep passing User to req.em.find
			const userRepository = req.em.getRepository(User);

			//Find our two user IDs, so we can link them into our new message
			const senderEntity = await userRepository.getReference(sender_id);
			const receiverEntity = await userRepository.getReference(receiver_id);

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
			return reply.status(500).send({ message: err.message });
		}
	});

	app.search<{ Body: { receiver_id: number } }>("/messages/received", async (req, reply) => {
		const { receiver_id } = req.body;

		try {
			const receiverEntity = await req.em.getReference(User, receiver_id);
			const messages = await req.em.find(Message, { receiver: receiverEntity });
			return reply.send(messages);
		} catch (err) {
			return reply.status(500).send({ message: err.message });
		}
	});

	app.search<{ Body: { sender_id: number } }>("/messages/sent", async (req, reply) => {
		const { sender_id } = req.body;

		try {
			const senderEntity = await req.em.getReference(User, sender_id);
			const messages = await req.em.find(Message, { sender: senderEntity });
			return reply.send(messages);
		} catch (err) {
			return reply.status(500).send({ message: err.message });
		}
	});

	app.put<{ Body: { message_id: number; message: string } }>("/messages", async (req, reply) => {
		const { message_id, message } = req.body;

		try {
			const msg = await req.em.findOneOrFail(Message, message_id, {strict: true});
			msg.message = message;
			await req.em.persistAndFlush(msg);
			return reply.send(msg);
		} catch (err) {
			return reply.status(500).send({ message: err.message });
		}
	});

	// Delete a specific message -- should we check for admin role here? Probably!
	app.delete<{ Body: { my_id: number, message_id: number; password: string } }>("/messages", async (req, reply) => {
		const { my_id, message_id, password } = req.body;

		try {
			const me = await req.em.findOneOrFail(User, my_id, {strict: true});
			// Check passwords match
			if (me.password !== password) {
				return reply.status(401).send();
			}

			const msgToDelete = await req.em.findOneOrFail(Message, message_id, {strict: true});
			await req.em.removeAndFlush(msgToDelete);
			return reply.send();
		} catch (err) {
			return reply.status(500).send({ message: err.message });
		}
	});

	// Delete all sent messages
	app.delete<{ Body: { my_id: number, password: string } }>(
		"/messages/all",
		async (req, reply) => {
			const { my_id, password } = req.body;

			try {
				const me = await req.em.findOneOrFail(User, my_id, { strict: true });

				// Check passwords match
				if (me.password !== password) {
					return reply.status(401).send();
				}

				// populate our messages_sent relation
				await me.messages_sent.init();
				// Remove them all from the collection, which because of orphanRemoval: true, will also delete them fully
				me.messages_sent.removeAll();

				await req.em.flush();

				return reply.status(200).send();
			} catch (err) {
				return reply.status(500).send({ message: err.message });
			}
		}
	);
}
