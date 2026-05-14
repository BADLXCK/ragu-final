import { Metadata } from 'next';
import { getSeoByUri } from '@/api/queries/getSeoByUri';
import { ProductPage } from "@/routes/product";

const BASE_URI = '/product/';

type Props = {
  params: Promise<{ category: string; product: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await params;
  return await getSeoByUri(`${BASE_URI}${product}/`);
}

export const dynamicParams = true;
export const revalidate = 60;

export default ProductPage;
