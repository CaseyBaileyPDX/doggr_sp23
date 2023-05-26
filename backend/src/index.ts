import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

app.listen({ port: Number(process.env.PORT), host: process.env.HOST},
	(err, address) => {
		if (err) {
			app.log.error(err);
			process.exit(1);
		}
		app.log.info(`Started server at ${address}`);
		app.log.debug("Debug level");
		app.log.trace("Trace level");
	}
);
