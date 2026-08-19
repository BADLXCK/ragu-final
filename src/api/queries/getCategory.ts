import { client } from '../client';
import { graphql } from '../gql';

export const getCategory = async (slug: string) => {
	const query = graphql(`
		query getCategory($slug: [String]) {
			productCategories(where: { slug: $slug }) {
				nodes {
					id
					name
					slug
				}
			}
		}
	`);

	const response = await client.request(query, { slug: [slug] });

	return response.productCategories?.nodes[0] ?? null;
};
