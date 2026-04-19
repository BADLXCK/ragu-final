import { GraphQLClient } from 'graphql-request';

let client: GraphQLClient | null = null;

export const getClient = () => {
	if (!client) {
		client = new GraphQLClient(`${process.env.SCHEMA_URL}`);
	}
	return client;
};
