import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { ContactsPage } from './_page';

const PAGE_URI = '/contacts/';
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
	return await getSeoByUri(PAGE_URI);
}

export default ContactsPage;
