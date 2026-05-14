import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { ConditionsPage } from '@/routes/conditions';

const PAGE_URI = '/banquet/choose-event/conditions/';
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
	return await getSeoByUri(PAGE_URI);
}

export default ConditionsPage;
