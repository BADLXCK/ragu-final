import { client } from '../client';
import { ExtendedProduct } from '../gql/extended-types';
import { graphql } from '../gql/gql';

export const getProduct = async (
	slug: string,
): Promise<ExtendedProduct | undefined> => {
	const query = graphql(`
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
						productCategories {
							nodes {
								slug
							}
						}
						... on SimpleProduct {
							price(format: RAW)
						}
					}
				}
			}
		}
	`);

	const response = await client.request(query, { slug });

	return response.products?.edges[0]?.node;
};
