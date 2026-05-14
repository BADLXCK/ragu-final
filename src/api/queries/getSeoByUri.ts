import { Metadata } from 'next';

const WP_URL =
	process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8080';

export const getSeoByUri = async (uri: string): Promise<Metadata> => {
	try {
		const encodedUri = encodeURIComponent(uri);
		const res = await fetch(
			`${WP_URL}/wp-json/seo/v1/page?uri=${encodedUri}`,
			{
				next: { revalidate: 3600 },
			},
		);

		if (!res.ok) return {};

		const data = await res.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error(`SEO fetch error for ${uri}:`, error);
		return {};
	}
};
