import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

app.listen({ port: 8080}, 
	(err, address) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(`Started server at ${address}`);
	}
);
