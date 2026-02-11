import { getProductsByCategory } from "@/api/queries/getProductsByCategory";
import { getCategories } from "@/api/queries/getCategories";
import { ProductPage } from "@/routes/product";

export async function generateStaticParams() {
    const categories = await getCategories();
    const params: { category: string, product: string }[] = [];

    for (const category of categories) {
        if (!category.slug) continue;

        const categoryProducts = await getProductsByCategory(category.slug);

        for (const product of categoryProducts) {
            if (!product.slug) continue;

            params.push({
                category: category.slug,
                product: product.slug,
            });
        }
    }

    return params;
}

export default ProductPage