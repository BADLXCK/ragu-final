import { gql } from 'graphql-request';
import { getClient } from '../client';
import { ProductCategory, ProductCategoryConnection } from '../gql/graphql';

export const getCategories = async (): Promise<ProductCategory[]> => {
	const query = gql`
		query getCategories {
			productCategories(first: 1000, where: { hideEmpty: false }) {
				nodes {
					id
					name
					slug
				}
			}
		}
	`;

	const response: { productCategories: ProductCategoryConnection } =
		await getClient().request(query);

	return response.productCategories.nodes;
};
