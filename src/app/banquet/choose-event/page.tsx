import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { ChooseEventPage } from "@/routes/choose-event";

const PAGE_URI = '/banquet/choose-event/';
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
	return await getSeoByUri(PAGE_URI);
}

export default ChooseEventPage;