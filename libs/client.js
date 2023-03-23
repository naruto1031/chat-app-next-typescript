import { createClient } from "microcms-js-sdk";

export const client = createClient({
	serviceDomain: "chat",
	apiKey: process.env.API_KEY,
})