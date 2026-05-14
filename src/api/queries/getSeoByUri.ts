export type SeoData = {
	title?: string;
	description?: string;
	og_image?: string;
};

const WP_URL =
	process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8080';

export const getSeoByUri = async (uri: string): Promise<SeoData | null> => {
	try {
		const encodedUri = encodeURIComponent(uri);
		const res = await fetch(
			`${WP_URL}/wp-json/seo/v1/page?uri=${encodedUri}`,
			{ next: { revalidate: 3600 } },
		);
		if (!res.ok) return null;
		const data = await res.json();
		return data || null;
	} catch {
		return null;
	}
};
