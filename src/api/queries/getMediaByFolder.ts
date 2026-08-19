import { client } from '../client';
import { graphql } from '../gql';

export interface MediaPage {
	nodes: {
		databaseId: number;
		sourceUrl: string | null;
		altText: string | null;
	}[];
	hasNextPage: boolean;
	endCursor: string | null;
}

export const getMediaByFolder = async (
	folderName: string,
	after?: string | null,
	first = 100,
): Promise<MediaPage> => {
	const query = graphql(`
		query getMediaByFolder($folderName: String!, $after: String, $first: Int) {
			mediaByFolder(where: { folderName: $folderName }, first: $first, after: $after) {
				nodes {
					databaseId
					sourceUrl
					altText
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}
	`);

	const response = await client.request(query, {
		folderName,
		after: after ?? null,
		first,
	});

	return {
		nodes: response.mediaByFolder?.nodes ?? [],
		hasNextPage: response.mediaByFolder?.pageInfo?.hasNextPage ?? false,
		endCursor: response.mediaByFolder?.pageInfo?.endCursor ?? null,
	};
};
