import { Product } from './graphql';

/**
 * Расширенный тип Product с кастомными полями
 */
export interface ExtendedProduct extends Product {
	/** Кастомное поле: вес продукта в граммах */
	customWeight?: string | null;
	/** Кастомное поле: содержание белков в граммах */
	customProtein?: string | null;
	/** Кастомное поле: содержание жиров в граммах */
	customFat?: string | null;
	/** Кастомное поле: содержание углеводов в граммах */
	customCarbohydrate?: string | null;
	/** Цена продукта */
	price?: string | null;
}
