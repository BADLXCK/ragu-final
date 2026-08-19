import { getProductsByCategory } from '@/api/queries/getProductsByCategory';

interface UseProductNavigation {
	category: string;
	product: string;
}

export const useProductNavigation = async ({
	category,
	product,
}: UseProductNavigation) => {
	const products = await getProductsByCategory(category);
	const productIndex = products.findIndex(item => item.slug === product);

	const nextProduct =
		productIndex !== products.length - 1
			? products[productIndex + 1]
			: null;

	const previousProduct =
		productIndex !== 0 ? products[productIndex - 1] : null;

	return { nextProduct, previousProduct };
};
