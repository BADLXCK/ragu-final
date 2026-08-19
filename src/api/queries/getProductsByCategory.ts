import { client } from '../client';
import { graphql } from '../gql';
import { ExtendedProduct } from '../gql/extended-types';

export const getProductsByCategory = async (
	categorySlug: string,
): Promise<ExtendedProduct[]> => {
	const query = graphql(`
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

	const response = await client.request(query, { categorySlug });

	return (response.products?.edges ?? []).map(({ node }) => ({
		...node,
		category: node.productCategories?.nodes[0]?.slug,
	}));
};
