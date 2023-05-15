import dotenv from "dotenv";
dotenv.config();
import {FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import Jwt, {VerifyPayloadType} from "@fastify/jwt";
import fp from "fastify-plugin";

declare module 'fastify' {
	interface FastifyRequest {
		// You can easily find the type of this return using intellisense inferral below
		jwtVerify(): Promise<VerifyPayloadType>
	}
	interface FastifyInstance {
		auth(): void,
	}
}

export const AuthPlugin = fp(async function(app: FastifyInstance, opts: FastifyPluginOptions) {
	app.register(import("@fastify/jwt"), {
		secret: process.env.AUTH_SECRET
	});

	app.decorate("auth", async function(request: FastifyRequest, reply: FastifyReply) {
		try {
			await request.jwtVerify();
		} catch (err) {
			reply.send(err);
		}
	})
})
