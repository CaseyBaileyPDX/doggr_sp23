import dotenv from "dotenv";
import Fastify, {FastifyReply, FastifyRequest} from "fastify";
import {User} from "./db/entities/User.js";
import config from "./db/mikro-orm.config.js";
import {FastifyMikroOrmPlugin} from "./plugins/mikro.js";

dotenv.config();

const app = Fastify();

await app.register(FastifyMikroOrmPlugin, config);

app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
	return 'Hilo';
}); 

app.get("/dbTest", async (request: FastifyRequest, reply: FastifyReply) => {
	return request.em.find(User, {});
});

app.listen({ port: 8080}, 
	(err, address) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(`Started server at ${address}`);
	}
);
