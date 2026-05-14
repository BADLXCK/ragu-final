import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { AfishaPage } from '@/routes/afisha';

const PAGE_URI = '/afisha/';

export async function generateMetadata(): Promise<Metadata> {
	return await getSeoByUri(PAGE_URI);
}

export default AfishaPage;
