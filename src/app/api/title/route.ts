import { NextRequest, NextResponse } from 'next/server';
import { gql } from 'graphql-request';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const slug = searchParams.get('slug');

	if (!slug) {
		return NextResponse.json({ title: '' });
	}

	try {
		// Используем прямой URL к WordPress GraphQL
		const response = await fetch('http://wordpress:80/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: `
                    query getPageTitle($slug: String!) {
                        pageBy(uri: $slug) {
                            title
                        }
                    }
                `,
				variables: { slug },
			}),
		});

		const data = await response.json();
		const title = data.data?.pageBy?.title || '';

		return NextResponse.json({ title });
	} catch (error) {
		console.error('Error fetching title:', error);
		return NextResponse.json({ title: '' });
	}
}
