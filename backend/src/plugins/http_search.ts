import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
	interface FastifyInstance {
		search: <T>(path: string, handler: any) => void;
	}
}

const fastifySearchHttpMethod = async function (app: FastifyInstance, options) {
	const search = function search<T>(path, handler) {
		app.route<T>({
			method: "SEARCH",
			url: path,

			handler,
		});
	};

	app.decorate("search", search);
};

export const FastifySearchHttpMethodPlugin = fp(fastifySearchHttpMethod, {
	name: "fastify-search-http-method",
});
