import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { InfoPage } from '@/routes/info';

const PAGE_URI = '/info/';
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
	return await getSeoByUri(PAGE_URI);
}

export default InfoPage;
