import { MikroORM, Options } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";

import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

// A type that represents deeply nested structure (A value inside a promise) and extracts (safely) the inner value
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

type FastifyMikroOrmOptions = {
	forkOnRequest?: boolean;
};

export type MikroORMPluginOptions = Options & FastifyMikroOrmOptions;

declare module "fastify" {
	interface FastifyInstance {
		db: Awaited<ReturnType<(typeof MikroORM)["init"]>>;
	}

	interface FastifyRequest {
		db: Awaited<ReturnType<(typeof MikroORM)["init"]>>;
		em: EntityManager | undefined;
	}
}

export const fastifyMikroORMCore: FastifyPluginAsync<MikroORMPluginOptions> = async function (
	fastify,
	options
) {
	if (options.forkOnRequest === undefined) {
		options.forkOnRequest = true;
	}

	const db = await MikroORM.init(options);

	// gives us access to `app.db`
	fastify.decorate("db", db);

	if (options.forkOnRequest) {
		fastify.addHook("onRequest", async function (this: typeof fastify, request, reply) {
			request.db = Object.assign({}, this.db);
			// Must fork context as per https://mikro-orm.io/docs/identity-map/
			request.em = request.db.em.fork() as EntityManager;
		});
	} else {
		fastify.addHook("onRequest", async function (this: typeof fastify, request, reply) {
			request.db = this.db;
			request.em = undefined;
		});
	}

	fastify.addHook("onClose", () => db.close());
};

export const FastifyMikroOrmPlugin = fp(fastifyMikroORMCore, {
	name: "fastify-mikro-orm",
});
