import { FastifyInstance } from "fastify";
import { Match } from "../db/entities/Match.js";
import { Pass } from "../db/entities/Pass.js";
import { User } from "../db/entities/User.js";


export function MatchRoutesInit(app: FastifyInstance) {
// CREATE MATCH ROUTE
	/* Refactor - note our change to getReference!

	 getReference/getReference retrieves an entity by its primary key, but it does not actually fetch
	 the entity from the database until you attempt to access its properties. This is used when
	 you just need a reference to an entity in order to establish a relationship with another entity.
	 */
	app.post<{ Body: { id: number; matchee_id: number } }>("/match", async (req, reply) => {
		const { id, matchee_id } = req.body;

		try {
			const matchee = await req.em.getReference(User, matchee_id);
			// do the same for the matcher/owner
			const owner = await req.em.getReference(User, id);

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
			return reply.status(500).send(err);
		}
	});

	app.post<{ Body: { sender_id: number; passee_id: number } }>("/pass", async (req, reply) => {
		const { sender_id, passee_id } = req.body;

		try {
			const passee = await req.em.getReference(User, passee_id);
			// do the same for the matcher/owner
			const owner = await req.em.getReference(User, sender_id);

			//create a new match between them
			const newPass = await req.em.create(Pass, {
				owner,
				passee,
			});

			//persist it to the database
			await req.em.flush();
			// send the match back to the user
			return reply.send(newPass);
		} catch (err) {
			return reply.status(500).send(err);
		}
	});
}
