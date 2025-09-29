import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface VirtualizedListProps<T> {
    items: T[];
    height: number;
    itemHeight: number;
    renderItem: (props: { index: number; data: T }) => React.ReactNode;
    className?: string;
    overscanCount?: number;
}

function VirtualizedListComponent<T>({
    items,
    height,
    itemHeight,
    renderItem,
    className,
    overscanCount = 5,
}: VirtualizedListProps<T>) {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);

    const startIndex = Math.max(
        0,
        Math.floor(scrollTop / itemHeight) - overscanCount
    );
    const endIndex = Math.min(
        items.length - 1,
        Math.ceil((scrollTop + height) / itemHeight) + overscanCount
    );

    const visibleItems = items.slice(startIndex, endIndex + 1);
    const totalHeight = items.length * itemHeight;
    const offsetY = startIndex * itemHeight;

    return (
        <div
            ref={containerRef}
            className={cn('w-full overflow-auto', className)}
            style={{ height }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div
                    style={{
                        transform: `translateY(${offsetY}px)`,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                    }}
                >
                    {visibleItems.map((item, index) => (
                        <div
                            key={startIndex + index}
                            style={{ height: itemHeight }}
                        >
                            {renderItem({
                                index: startIndex + index,
                                data: item,
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export const VirtualizedList = memo(VirtualizedListComponent) as <T>(
    props: VirtualizedListProps<T>
) => React.JSX.Element;
