import { gql } from 'graphql-request';
import { client } from '../client';
import { ExtendedProduct } from '../gql/extended-types';

export const getProductsByCategory = async (
	categorySlug: string,
): Promise<ExtendedProduct[]> => {
	const query = gql`
		query getProductsByCategory($categorySlug: String!) {
			products(first: 1000, where: { category: $categorySlug }) {
				edges {
					node {
						id
						name
						description(format: RAW)
						slug
						customWeight
						customProtein
						customFat
						customCarbohydrate
						image {
							filePath
							altText
						}
						... on SimpleProduct {
							price(format: RAW)
						}
					}
				}
			}
		}
	`;

	const response: {
		products: { edges: { node: ExtendedProduct }[] };
	} = await client.request(query, { categorySlug });

	return response.products.edges.map(edge => edge.node);
};
