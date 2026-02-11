import { gql } from 'graphql-request';
import { client } from '../client';
import { MenuItem, MenuItemConnection } from '../gql/graphql';

export const getNavigationItems = async (): Promise<MenuItem[]> => {
	const query = gql`
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
	`;

	const response: { menuItems: MenuItemConnection } = await client.request(
		query,
	);

	return response.menuItems.edges.map(edge => edge.node);
};
