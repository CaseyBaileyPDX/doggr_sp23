import {constants} from "crypto";
import SSL_OP_NO_SSLv2 = module

export function response(res) {
	function end(content) {
		res.setHeader("Content-Length", content.length);
		res.status(200);
		res.end(content);
		return res;
	}
	
	
	// 200 vs 404
	res.status = (code) => {
		res.statusCode = code || res.statusCode;
		return res;
	};
	
	res.send = (content) => {
		res.setHeader("Content-Type", "text/html");
		return end(content);
	};
	
	res.json = (content) => {
		content = JSON.stringify(content);
		res.setHeader("Content-Type", "application/json");
		return end(content);
	};
	
	res.redirect = (url) => {
		res.setHeader("Location", url);
		res.status(301);
		res.end();
		return res;
	};
	
}
