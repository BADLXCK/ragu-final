export interface IProductCategory {
	id: string;
	name: string;
	slug: string;
}

export interface ICategoryProduct {
	id: string;
	name: string;
	description?: string;
	price?: number;
	weight?: number;
	image?: {
		src: string;
		alt: string;
	};
	slug?: string;
}

export interface IEvent {
	id: string;
	eventdate?: string;
	eventdescription?: string;
	eventname?: string;
	eventimage?: {
		node?: {
			srcSet?: string;
			sourceUrl?: string;
			altText?: string;
		};
	};
}

export { getEvents } from './queries/getEvents';
