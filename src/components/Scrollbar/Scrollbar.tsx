'use client';

import { usePathname } from 'next/navigation';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import styles from './Scrollbar.module.scss';

interface ScrollbarProps {
	/** ID of the scrollable element to track */
	targetId: string;
	/** ID of the element to use as positioning anchor (track will match its height/position) */
	anchorId?: string;
	className?: string;
}

interface TrackRect {
	top: number;
	height: number;
	right: number;
}

export const Scrollbar: FC<ScrollbarProps> = ({
	targetId,
	anchorId,
	className,
}) => {
	const pathname = usePathname();

	// Если в пути более 2-х сегментов после /menu/, значит это страница товара
	// Пример: /menu/goryachee/ - 2 сегмента (категория)
	// Пример: /menu/goryachee/steak - 3 сегмента (товар)
	const segments = pathname.split('/').filter(Boolean);
	const isProductPage = segments.length > 2 && segments[0] === 'menu';

	const [thumbHeight, setThumbHeight] = useState(0);
	const [thumbTop, setThumbTop] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const [trackRect, setTrackRect] = useState<TrackRect | null>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef<{
		isDragging: boolean;
		startY: number;
		startScrollTop: number;
	} | null>(null);

	const updateTrackRect = useCallback(() => {
		if (isProductPage) return;
		if (!anchorId) return;
		const anchor = document.getElementById(anchorId);
		if (!anchor) return;
		const rect = anchor.getBoundingClientRect();
		setTrackRect({
			top: rect.top,
			height: rect.height,
			right: window.innerWidth - rect.right,
		});
	}, [anchorId, isProductPage]);

	const handleScroll = useCallback(() => {
		if (isProductPage) return;
		const target = document.getElementById(targetId);
		if (!target || !trackRef.current) return;

		const { scrollTop, scrollHeight, clientHeight } = target;

		if (scrollHeight <= clientHeight) {
			setIsVisible(false);
			return;
		}

		setIsVisible(true);

		const trackHeight = trackRef.current.clientHeight;
		const newThumbHeight = Math.max(
			(clientHeight / scrollHeight) * trackHeight,
			40,
		);

		const maxScrollTop = scrollHeight - clientHeight;
		const scrollPercentage =
			maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;

		const maxThumbTop = trackHeight - newThumbHeight;
		const newThumbTop = scrollPercentage * maxThumbTop;

		setThumbHeight(newThumbHeight);
		setThumbTop(newThumbTop);
	}, [targetId, isProductPage]);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			if (isProductPage) return;
			const target = document.getElementById(targetId);
			if (!target || !trackRef.current) return;

			e.preventDefault();
			dragRef.current = {
				isDragging: true,
				startY: e.clientY,
				startScrollTop: target.scrollTop,
			};

			document.body.style.userSelect = 'none';
			document.body.style.cursor = 'grabbing';
		},
		[targetId, isProductPage],
	);

	useEffect(() => {
		if (isProductPage) return;

		const handleMouseMove = (e: MouseEvent) => {
			if (!dragRef.current?.isDragging || !trackRef.current) return;

			const target = document.getElementById(targetId);
			if (!target) return;

			const deltaY = e.clientY - dragRef.current.startY;
			const trackHeight = trackRef.current.clientHeight;
			const scrollHeight = target.scrollHeight;

			const scrollRatio = scrollHeight / trackHeight;
			target.scrollTop =
				dragRef.current.startScrollTop + deltaY * scrollRatio;
		};

		const handleMouseUp = () => {
			if (dragRef.current?.isDragging) {
				dragRef.current.isDragging = false;
				document.body.style.userSelect = '';
				document.body.style.cursor = '';
			}
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [targetId, isProductPage]);

	useEffect(() => {
		if (isProductPage) return;

		const target = document.getElementById(targetId);
		const anchor = anchorId ? document.getElementById(anchorId) : null;

		updateTrackRect();

		const resizeObserver = new ResizeObserver(() => {
			updateTrackRect();
			handleScroll();
		});

		if (target) {
			target.addEventListener('scroll', handleScroll);
			resizeObserver.observe(target);
			handleScroll();
		}

		if (anchor) {
			resizeObserver.observe(anchor);
		}

		window.addEventListener('resize', updateTrackRect);

		return () => {
			target?.removeEventListener('scroll', handleScroll);
			resizeObserver.disconnect();
			window.removeEventListener('resize', updateTrackRect);
		};
	}, [targetId, anchorId, handleScroll, updateTrackRect, isProductPage]);

	// Если это страница товара, не рендерим ничего
	if (isProductPage) return null;

	const trackStyle = trackRect
		? {
				position: 'fixed' as const,
				top: `${trackRect.top}px`,
				height: `${trackRect.height - 100}px`,
				right: `${trackRect.right - 30}px`,
			}
		: undefined;

	if (!isVisible) {
		return (
			<div
				ref={trackRef}
				className={`${styles.track} ${className ?? ''}`}
				style={{ ...trackStyle, visibility: 'hidden' }}
			/>
		);
	}

	return (
		<div
			ref={trackRef}
			className={`${styles.track} ${className ?? ''}`}
			style={trackStyle}
		>
			<div
				className={styles.thumb}
				onMouseDown={handleMouseDown}
				style={{
					height: `${thumbHeight}px`,
					transform: `translateY(${thumbTop}px)`,
					cursor: 'grab',
				}}
			/>
		</div>
	);
};
