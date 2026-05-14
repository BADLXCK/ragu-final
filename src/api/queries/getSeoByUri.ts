import { Metadata } from 'next';

const WP_URL =
	process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8080';

export const getSeoByUri = async (uri: string): Promise<Metadata> => {
	try {
		const encodedUri = encodeURIComponent(uri);
		const fetchUrl = `${WP_URL}/wp-json/seo/v1/page?uri=${encodedUri}`;

		const res = await fetch(fetchUrl, {
			next: { revalidate: 60 },
		});

		if (!res.ok) {
			console.error(`SEO API Error: ${res.status} for ${uri}`);
			return {};
		}

		const data = await res.json();

		// Лог для проверки в Docker (можно будет убрать потом)
		if (Object.keys(data).length === 0) {
			console.warn(`SEO API returned empty data for ${uri}`);
		}

		return data;
	} catch (error) {
		console.error(`SEO fetch error for ${uri}:`, error);
		return {};
	}
};
