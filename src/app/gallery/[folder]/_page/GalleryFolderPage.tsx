import { PhotoGallery } from '@/components/PhotoGallery';
import { getMediaByFolder } from '@/api/queries/getMediaByFolder';
import styles from './GalleryFolderPage.module.css';

const FOLDER_TITLES: Record<string, string> = {
	birthday: 'День рождения',
	event: 'Торжественное мероприятие',
	corporate: 'Корпоратив',
	other: 'Другое',
};

async function getAllPhotos(folder: string) {
	const photos = [];
	let after: string | null = null;
	let guard = 0;

	do {
		const page = await getMediaByFolder(folder, after);
		photos.push(...page.nodes);
		if (!page.hasNextPage || !page.endCursor) break;
		after = page.endCursor;
		guard++;
	} while (guard < 100);

	return photos;
}

export async function GalleryFolderPage({ folder }: { folder: string }) {
	const photos = await getAllPhotos(folder).catch(() => []);
	const title = FOLDER_TITLES[folder] ?? folder;

	return (
		<div className={styles.wrapper}>
			<h1 className={styles.title}>{title}</h1>
			{photos.length > 0 ? (
				<PhotoGallery photos={photos} />
			) : (
				<p className={styles.empty}>
					В этой галерее пока нет фотографий
				</p>
			)}
		</div>
	);
}
