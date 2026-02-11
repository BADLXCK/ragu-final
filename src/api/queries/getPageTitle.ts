import { gql } from 'graphql-request';
import { client } from '../client';
import { Page } from '../gql/graphql';

export const getPageTitle = async (slug?: string): Promise<string> => {
	if (!slug) {
		return '';
	}

	const query = gql`
		query getPageTitle($slug: String!) {
			pageBy(uri: $slug) {
				title
			}
		}
	`;

	const response: { pageBy: { title: string } } = await client.request(
		query,
		{
			slug,
		},
	);

	return response.pageBy.title;
};
