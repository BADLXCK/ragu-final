import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { ReviewsPage } from '@/routes/reviews';

const PAGE_URI = '/reviews/';
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
	return await getSeoByUri(PAGE_URI);
}

export default ReviewsPage;
