import { getCategories } from "@/api/queries/getCategories";
import { CategoryPage } from "@/routes/category";

export async function generateStaticParams() {
    const categories = await getCategories();

    return categories.map(category => ({
        category: category.slug,
    }));
};

export default CategoryPage;