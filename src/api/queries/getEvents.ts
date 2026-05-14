import { gql } from 'graphql-request';
import { client } from '../client';
import type { IEvent, IEventConnection } from '../manual-types';

export const getEvents = async (): Promise<IEvent[]> => {
	const query = gql`
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
	`;

	const response: { events: IEventConnection } = await client.request(query);

	return response.events.nodes;
};
