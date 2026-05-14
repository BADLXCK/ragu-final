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

export interface IEventConnection {
	nodes: IEvent[];
}
