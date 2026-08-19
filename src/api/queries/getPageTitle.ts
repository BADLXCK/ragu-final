import { client } from '../client';
import { graphql } from '../gql';

export const getPageTitle = async (slug?: string) => {
	if (!slug) {
		return '';
	}

	const query = graphql(`
		query getPageTitle($slug: String!) {
			pageBy(uri: $slug) {
				title
			}
		}
	`);

	const response = await client.request(query, { slug });

	return response.pageBy?.title ?? '';
};
