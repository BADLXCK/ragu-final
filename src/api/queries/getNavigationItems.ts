import { client } from '../client';
import { graphql } from '../gql';

export const getNavigationItems = async () => {
	const query = graphql(`
		query getNavigationItems {
			menuItems(where: { location: PRIMARY }) {
				edges {
					node {
						id
						url
						uri
						path
						label
					}
				}
			}
		}
	`);

	const response = await client.request(query);

	return response.menuItems?.edges.map(edge => edge.node) ?? [];
};
