import { client } from '../client';
import { graphql } from '../gql';

export const getEvents = async () => {
	const query = graphql(`
		query getEvents {
			events(first: 1000, where: { status: PUBLISH }) {
				nodes {
					id
					eventdate
					eventdescription
					eventname
					eventimage {
						node {
							srcSet
							sourceUrl
							altText
						}
					}
				}
			}
		}
	`);

	const response = await client.request(query).catch((error: unknown) => {
		console.error('[getEvents] request failed:', error);
		return undefined;
	});

	return response?.events?.nodes ?? [];
};
