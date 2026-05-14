import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { CategoryPage } from '@/routes/category';

const BASE_URI = '/product-category/';

export async function generateMetadata({
	params,
}: PageProps<'/menu/[category]'>): Promise<Metadata> {
	const { category } = await params;

	return await getSeoByUri(`${BASE_URI}${category}/`);
}

export default CategoryPage;
