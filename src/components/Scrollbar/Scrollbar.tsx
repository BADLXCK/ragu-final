'use client';

import { FC, useEffect, useState, useCallback, useRef } from 'react';
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

export const Scrollbar: FC<ScrollbarProps> = ({ targetId, anchorId, className }) => {
	const [thumbHeight, setThumbHeight] = useState(0);
	const [thumbTop, setThumbTop] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const [trackRect, setTrackRect] = useState<TrackRect | null>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef<{ isDragging: boolean; startY: number; startScrollTop: number } | null>(null);

	// Update the track position/size to match the anchor element
	const updateTrackRect = useCallback(() => {
		if (!anchorId) return;
		const anchor = document.getElementById(anchorId);
		if (!anchor) return;
		const rect = anchor.getBoundingClientRect();
		setTrackRect({
			top: rect.top,
			height: rect.height,
			right: window.innerWidth - rect.right,
		});
	}, [anchorId]);

	// Recalculate thumb position based on scroll state
	const handleScroll = useCallback(() => {
		const target = document.getElementById(targetId);
		if (!target || !trackRef.current) return;

		const { scrollTop, scrollHeight, clientHeight } = target;

		if (scrollHeight <= clientHeight) {
			setIsVisible(false);
			return;
		}

		setIsVisible(true);

		const trackHeight = trackRef.current.clientHeight;
		const newThumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 40);

		const maxScrollTop = scrollHeight - clientHeight;
		const scrollPercentage = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;

		const maxThumbTop = trackHeight - newThumbHeight;
		const newThumbTop = scrollPercentage * maxThumbTop;

		setThumbHeight(newThumbHeight);
		setThumbTop(newThumbTop);
	}, [targetId]);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
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
	}, [targetId]);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!dragRef.current?.isDragging || !trackRef.current) return;

			const target = document.getElementById(targetId);
			if (!target) return;

			const deltaY = e.clientY - dragRef.current.startY;
			const trackHeight = trackRef.current.clientHeight;
			const scrollHeight = target.scrollHeight;
			const clientHeight = target.clientHeight;
			
			// Ratio of scrollable content to scrollable track area
			const scrollRatio = scrollHeight / trackHeight;
			
			target.scrollTop = dragRef.current.startScrollTop + deltaY * scrollRatio;
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
	}, [targetId]);

	useEffect(() => {
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
	}, [targetId, anchorId, handleScroll, updateTrackRect]);

	// Inline styles for dynamic positioning from anchor
	const trackStyle = trackRect
		? {
				position: 'fixed' as const,
				top: `${trackRect.top}px`,
				height: `${trackRect.height - 100}px`,
				// Ensure scrollbar stays visible: center it on the border, but don't let it go off-screen
				right: `${trackRect.right - 30}px`, 
		  }
		: undefined;

	if (!isVisible) {
		return <div ref={trackRef} className={`${styles.track} ${className ?? ''}`} style={{ ...trackStyle, visibility: 'hidden' }} />;
	}

	return (
		<div ref={trackRef} className={`${styles.track} ${className ?? ''}`} style={trackStyle}>
			<div
				className={styles.thumb}
				onMouseDown={handleMouseDown}
				style={{
					height: `${thumbHeight}px`,
					transform: `translateY(${thumbTop}px)`,
					cursor: 'grab'
				}}
			/>
		</div>
	);
};
