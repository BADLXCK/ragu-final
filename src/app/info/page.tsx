import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { InfoPage } from './_page';

const PAGE_URI = '/info/';
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
	return await getSeoByUri(PAGE_URI);
}

export default InfoPage;
