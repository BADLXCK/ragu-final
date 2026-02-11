import { chunkArray } from "@/utils/chunkArray";
import { CSSProperties, FC } from "react";
import { nanoid } from 'nanoid';
import styles from './marquee.module.scss';

interface IMarquee<T> {
    data: T[],
    rowsCount?: number,
    style?: CSSProperties,
    children: FC<T & { key: string }>,
    className?: string,
};

interface IMarqueeContent<T> {
    items: T[],
    style?: CSSProperties,
    childComponent: FC<T & { key: string }>,
};

export function Marquee<T>({ data, rowsCount = 1, style, children, className }: IMarquee<T>) {
    const chunkedData = chunkArray(data, rowsCount);
    const contentStyle: CSSProperties = {
        animationDuration: '10s',
        ...style
    };

    return (
        <div className={`${styles.marqueeWrapper} ${className}`}>
            {chunkedData.map((chunk, index) =>
                <div key={nanoid()} className={styles.marqueeTrack}>
                    {Array(2).fill(true).map(() =>
                        <MarqueeContent
                            key={nanoid()}
                            items={chunk}
                            childComponent={children}
                            style={{
                                ...contentStyle,
                                animationDirection: index & 1 ? 'normal' : 'reverse',
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

function MarqueeContent<T>({ items, style, childComponent }: IMarqueeContent<T>) {
    return (
        <div className={`${styles.marqueeContent} ${styles.scroll}`} style={style}>
            {items.map(item => {
                const key = nanoid();
                const Component = childComponent;
                return <Component {...item} key={key} />;
            })}
        </div>
    )
}