import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { MainPage } from '@/routes/main';

const PAGE_URI = '/';
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
	return await getSeoByUri(PAGE_URI);
}

export default MainPage;
