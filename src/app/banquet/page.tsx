import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { BanquetPage } from '@/routes/banquet';

const PAGE_URI = '/banquet/';
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
	return await getSeoByUri(PAGE_URI);
}

export default BanquetPage;
