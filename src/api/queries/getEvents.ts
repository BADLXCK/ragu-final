import { gql } from 'graphql-request';
import { client } from '../client';
import { Event, EventConnection } from '../gql/graphql';

export const getEvents = async (): Promise<Event[]> => {
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

	const response: { events: EventConnection } = await client.request(query);

	return response.events.nodes;
};
