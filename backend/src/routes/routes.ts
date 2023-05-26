import dotenv from "dotenv";
dotenv.config();

import { FastifyInstance } from "fastify";
import { MatchRoutesInit } from "./match_routes.js";
import { MessageRoutesInit } from "./message_routes.js";
import { UserRoutesInit } from "./user_routes.js";

/** This function creates all backend routes for the site
 *
 * @param {FastifyInstance} app - The base Fastify listen server instance
 * @param {{}} _options - Fastify instance options (Optional)
 * @returns {Promise<void>} - Returns all of the initialized routes
 */
async function DoggrRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}

	UserRoutesInit(app);
	MatchRoutesInit(app);
	MessageRoutesInit(app);

	app.get("/", async (req, reply) => {
		reply.send("Hello world");
	})
}

export default DoggrRoutes;
