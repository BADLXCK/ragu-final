import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { GalleryPage } from '@/routes/gallery';

const PAGE_URI = '/gallery/';
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
	return await getSeoByUri(PAGE_URI);
}

export default GalleryPage;
