'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getWordPressUrl } from '@/lib/wordpress-url';
import styles from './PhotoGallery.module.css';

export interface Photo {
	databaseId: number;
	sourceUrl: string | null;
	altText: string | null;
}

interface PhotoGalleryProps {
	photos: Photo[];
}

const PHOTOS_PER_PAGE = 9;

function toInternalUrl(url: string): string {
	try {
		const parsed = new URL(url);
		return `${getWordPressUrl()}${parsed.pathname}${parsed.search}`;
	} catch {
		return url;
	}
}

function findScrollContainer(el: HTMLElement | null): HTMLElement | null {
	let node: HTMLElement | null = el;
	while (node) {
		if (/(auto|scroll|overlay)/.test(getComputedStyle(node).overflowY)) {
			return node;
		}
		node = node.parentElement;
	}
	return null;
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
	const [visibleCount, setVisibleCount] = useState(PHOTOS_PER_PAGE);
	const [activePage, setActivePage] = useState(0);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const masonryRef = useRef<HTMLDivElement | null>(null);
	const sentinelRef = useRef<HTMLDivElement | null>(null);

	const pageCount = Math.max(1, Math.ceil(photos.length / PHOTOS_PER_PAGE));
	const hasMore = visibleCount < photos.length;

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel || !hasMore) return;

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0]?.isIntersecting) {
					setVisibleCount(count => count + PHOTOS_PER_PAGE);
				}
			},
			{ rootMargin: '400px' },
		);

		observer.observe(sentinel);

		return () => observer.disconnect();
	}, [hasMore, photos.length]);

	useEffect(() => {
		const container = findScrollContainer(masonryRef.current);
		if (!container) return;

		const onScroll = () => {
			const max = container.scrollHeight - container.clientHeight;
			const ratio = max > 0 ? container.scrollTop / max : 1;
			setActivePage(
				Math.min(pageCount - 1, Math.round(ratio * (pageCount - 1))),
			);
		};

		container.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		return () => container.removeEventListener('scroll', onScroll);
	}, [pageCount]);

	const scrollToPage = (index: number) => {
		const target = Math.min(photos.length, (index + 1) * PHOTOS_PER_PAGE);
		setVisibleCount(count => Math.max(count, target));
		setTimeout(() => {
			const container = findScrollContainer(masonryRef.current);
			if (!container) return;
			const max = container.scrollHeight - container.clientHeight;
			container.scrollTo({
				top: (max / pageCount) * index,
				behavior: 'smooth',
			});
		}, 0);
	};

	const close = useCallback(() => setSelectedIndex(null), []);

	const prev = useCallback(() => {
		setSelectedIndex(i =>
			i === null ? i : (i - 1 + photos.length) % photos.length,
		);
	}, [photos.length]);

	const next = useCallback(() => {
		setSelectedIndex(i => (i === null ? i : (i + 1) % photos.length));
	}, [photos.length]);

	useEffect(() => {
		if (selectedIndex === null) return;

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') close();
			if (e.key === 'ArrowLeft') prev();
			if (e.key === 'ArrowRight') next();
		};

		window.addEventListener('keydown', onKey);
		document.body.style.overflow = 'hidden';

		return () => {
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = '';
		};
	}, [selectedIndex, close, prev, next]);

	const selected = selectedIndex !== null ? photos[selectedIndex] : null;
	const visiblePhotos = photos.slice(0, visibleCount);

	return (
		<>
			<div className={styles.masonry} ref={masonryRef}>
				{visiblePhotos.map((photo, index) => (
					<button
						key={photo.databaseId}
						type="button"
						className={styles.item}
						onClick={() => setSelectedIndex(index)}
						aria-label={`Открыть фото ${index + 1}`}
					>
						{photo.sourceUrl && (
							<Image
								src={toInternalUrl(photo.sourceUrl)}
								alt={photo.altText || ''}
								width={800}
								height={600}
								sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
								className={styles.image}
							/>
						)}
					</button>
				))}
			</div>

			<div ref={sentinelRef} className={styles.sentinel} />

			{pageCount > 1 && selectedIndex === null && (
				<div
					className={styles.dots}
					role="tablist"
					aria-label="Страницы галереи"
				>
					{Array.from({ length: pageCount }, (_, index) => (
						<button
							key={index}
							type="button"
							role="tab"
							aria-selected={index === activePage}
							aria-label={`Страница ${index + 1}`}
							className={`${styles.dot} ${index === activePage ? styles.active : ''}`}
							onClick={() => scrollToPage(index)}
						/>
					))}
				</div>
			)}

			{selected?.sourceUrl && (
				<div className={styles.overlay} onClick={close}>
					<div
						className={styles.viewer}
						onClick={e => e.stopPropagation()}
					>
						<button
							type="button"
							className={styles.close}
							onClick={close}
							aria-label="Закрыть"
						>
							✕
						</button>
						<button
							type="button"
							className={`${styles.arrow} ${styles.prev}`}
							onClick={prev}
							aria-label="Предыдущее фото"
						>
							‹
						</button>
						<Image
							src={toInternalUrl(selected.sourceUrl)}
							alt={selected.altText || ''}
							width={1600}
							height={1200}
							className={styles.full}
						/>
						<button
							type="button"
							className={`${styles.arrow} ${styles.next}`}
							onClick={next}
							aria-label="Следующее фото"
						>
							›
						</button>
					</div>
				</div>
			)}
		</>
	);
}
