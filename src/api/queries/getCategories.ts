import { client } from '../client';
import { graphql } from '../gql';

export const getCategories = async () => {
	const query = graphql(`
		query getCategories {
			productCategories(first: 1000, where: { hideEmpty: false }) {
				nodes {
					id
					name
					slug
				}
			}
		}
	`);

	const response = await client.request(query).catch((error: unknown) => {
		console.error('[getCategories] request failed:', error);
		return undefined;
	});

	return response?.productCategories?.nodes ?? [];
};
