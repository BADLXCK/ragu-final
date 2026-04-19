import { gql } from 'graphql-request';
import { getClient } from '../client';
import { Gallery } from '../gql/graphql';

export const getGalleryByName = async (
	name: string,
): Promise<Gallery | null> => {
	const query = gql`
		query NewQuery {
			galleries(where: { name: "${name}" }) {
				nodes {
					id
					slug
					title
					galleryId
					image {
						nodes {
							altText
							title
							sourceUrl
						}
					}
				}
			}
		}
	`;

	const response: {
		galleries: { nodes: Gallery[] };
	} = await getClient().request(query);

	return response.galleries.nodes[0] || null;
};
