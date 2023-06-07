import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Search } from "react-router-dom";

const serverIP = import.meta.env.API_HOST;
const serverPort = import.meta.env.PORT;

const serverUrl = `http://${serverIP}:${serverPort}`;

interface SearchableAxiosInstance extends AxiosInstance {
	search<T = any, R = AxiosResponse<T>>(path: string, data: any): Promise<R>;

}

let httpClient: SearchableAxiosInstance = axios.create({
	baseURL: serverUrl,
	headers: {
		"Content-type": "application/json",
	},

}) as SearchableAxiosInstance;

// Note we have to do this separately from axios.create above
// because it has to be first typecast to Searchable
httpClient.search = async(path, data) => {
	let config = {
		method: "SEARCH",
		url: serverUrl + path,
		data
	};
	return httpClient.request(config);

};

export { httpClient };
