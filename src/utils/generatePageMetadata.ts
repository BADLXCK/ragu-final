import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';

export const generatePageMetadata = async (
	uri: string,
	fallbackTitle: string,
	fallbackDescription: string,
): Promise<Metadata> => {
	const seo = await getSeoByUri(uri);

	return {
		title: seo?.title || fallbackTitle,
		description: seo?.description || fallbackDescription,
		openGraph: {
			title: seo?.title || fallbackTitle,
			description: seo?.description || fallbackDescription,
			images: seo?.og_image ? [{ url: seo.og_image }] : undefined,
		},
	};
};
