import { gql } from 'graphql-request';
import { client } from '../client';
import { ExtendedProduct } from '../gql/extended-types';

export const getProduct = async (slug: string): Promise<ExtendedProduct> => {
	const query = gql`
		query getProduct($slug: String!) {
			products(where: { slugIn: [$slug] }) {
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

	const response: { products: { edges: { node: ExtendedProduct }[] } } =
		await client.request(query, {
			slug,
		});

	return response.products.edges[0]?.node;
};
