import axios from "axios";
import {FastifyInstance} from "fastify";
import fp from "fastify-plugin";
const badUrl = "https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/badwordslist/badwords.txt"

/**
 * Here we fetch the newest list of bad words from Google
 * when our server boots, then convert it to a Set we can query against
 * later.  Because this list of bad words is MUCH longer than any
 * message itself will be, we can pick up some nice optimization
 * via this choice of data structure.  In our route, we'll split
 * the message itself and check only that smaller word list directly
 * against our pre-prepped Set.
 *
 * I chose this method over storing the file locally because
 * A) It places the burden of list maintenance solely on Google
 * B) It is (annoyingly) faster and easier to fetch from a
 *    backend than to deal with static files
 * C) We are free of having to respond to censorship complaints`
 *    as we're merely enforcing a standardized list sourced elsewhere
 * @returns {Promise<Set<string>>} A Set containing all the bad words
 */
export async function fetchBadWords() {
	// Fetch word list from google
	const wordRes = await axios.get(badUrl);
	const wordSet = new Set<string>();

	// Coerce the data into a Set
	wordRes.data.split("\r\n").forEach( (word) => {
		wordSet.add(word);
	});
	return wordSet;
}

declare module 'fastify' {
	interface FastifyInstance {
		badwords: Set<string>;
	}
}

// Put our words onto Fastify instance like our other plugins
const fastifyFetchBadWords = async function(app: FastifyInstance, _options) {
	const wordSet = await fetchBadWords();
	app.decorate("badwords", wordSet);
};

export const FastifyBadWordsPlugin = fp(fastifyFetchBadWords, {
	name: "fastify-bad-word-filter"
});
