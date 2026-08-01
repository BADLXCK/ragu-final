import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { MainPage } from '@/routes/MainPage';

const PAGE_URI = '/';

export async function generateMetadata(): Promise<Metadata> {
	return await getSeoByUri(PAGE_URI);
}

export default MainPage;
