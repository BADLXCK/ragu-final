import { gql } from 'graphql-request';
import { client } from '../client';
import { ProductCategory } from '../gql/graphql';

export const getCategory = async (
	slug: string,
): Promise<ProductCategory | null> => {
	const query = gql`
		query getCategory($slug: [String]) {
			productCategories(where: { slug: $slug }) {
				nodes {
					id
					name
					slug
				}
			}
		}
	`;

	const response: {
		productCategories: { nodes: ProductCategory[] };
	} = await client.request(query, { slug: [slug] });

	return response.productCategories.nodes[0] || null;
};
