import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

app.listen({ port: Number(process.env.PORT), host: process.env.HOST},
	(err, address) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(`Started server at ${address}`);
	}
);
