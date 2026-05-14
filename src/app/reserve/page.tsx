import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { ReservePage } from '@/routes/reserve';

const PAGE_URI = '/reserve/';
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
	return await getSeoByUri(PAGE_URI);
}

export default ReservePage;
