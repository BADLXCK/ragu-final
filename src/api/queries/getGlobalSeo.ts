export type GlobalSeoData = {
	title?: string;
	description?: string;
};

const WP_URL =
	process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8080';

export const getGlobalSeo = async (): Promise<GlobalSeoData | null> => {
	try {
		const res = await fetch(`${WP_URL}/wp-json/seo/v1/global`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
};
