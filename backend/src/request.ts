import url from "url";

export function request(req) {
	const parsedUrl = url.parse(`${req.headers.host}${req.url}`, true);
	const keys = Object.keys(parsedUrl);
	keys.forEach( (key) => (req[key] = parsedUrl[key]));
}
