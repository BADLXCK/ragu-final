import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { ProductPage } from '@/routes/ProductPage';

const BASE_URI = '/product/';

export async function generateMetadata({
	params,
}: PageProps<'/menu/[category]/[product]'>): Promise<Metadata> {
	const { product } = await params;
	return await getSeoByUri(`${BASE_URI}${product}/`);
}

export const revalidate = 60;

export default ProductPage;
