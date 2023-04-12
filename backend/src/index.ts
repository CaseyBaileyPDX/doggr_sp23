/* eslint-disable */
// @ts-nocheck
import * as dotenv from 'dotenv';
import {Nastify} from "./server.js";
dotenv.config();

let app = Nastify();

app.listen(8080, () => {
	console.log("Server listening on port 8080...");
})
