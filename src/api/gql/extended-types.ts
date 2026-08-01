/**
 * Расширенный тип продукта с кастомными полями
 */
export interface ExtendedProduct {
	id: string;
	name: string | null;
	description: string | null;
	slug: string | null;
	/** Кастомное поле: вес продукта в граммах */
	customWeight?: string | null;
	/** Кастомное поле: содержание белков в граммах */
	customProtein?: string | null;
	/** Кастомное поле: содержание жиров в граммах */
	customFat?: string | null;
	/** Кастомное поле: содержание углеводов в граммах */
	customCarbohydrate?: string | null;
	image?: {
		filePath?: string | null;
		altText?: string | null;
	} | null;
	productCategories?: {
		nodes: Array<{ slug: string | null }>;
	} | null;
	/** Цена продукта */
	price?: string | null;
	/** Slug категории продукта */
	category?: string | null;
}
