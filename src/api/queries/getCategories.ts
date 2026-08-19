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

	const response = await client.request(query);

	return response.productCategories?.nodes ?? [];
};
