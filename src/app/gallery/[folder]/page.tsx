import { Metadata } from 'next';
import { GalleryFolderPage } from './_page';

export const revalidate = 60;

export async function generateMetadata({
	params,
}: PageProps<'/gallery/[folder]'>): Promise<Metadata> {
	const { folder } = await params;

	return {
		title: `Галерея — ${folder}`,
	};
}

export default async function Page({ params }: PageProps<'/gallery/[folder]'>) {
	const { folder } = await params;

	return <GalleryFolderPage folder={folder} />;
}
