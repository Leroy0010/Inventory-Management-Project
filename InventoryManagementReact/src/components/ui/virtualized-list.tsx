import React, { memo, useMemo, useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface VirtualizedListProps<T> {
    items: T[];
    itemHeight: number;
    containerHeight: number;
    renderItem: (item: T, index: number) => React.ReactNode;
    className?: string;
    overscan?: number;
    onScroll?: (scrollTop: number) => void;
}

function VirtualizedList<T>({
    items,
    itemHeight,
    containerHeight,
    renderItem,
    className,
    overscan = 5,
    onScroll,
}: VirtualizedListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);

    const { visibleItems, startIndex, endIndex, totalHeight } = useMemo(() => {
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const startIndex = Math.max(
            0,
            Math.floor(scrollTop / itemHeight) - overscan
        );
        const endIndex = Math.min(
            items.length - 1,
            startIndex + visibleCount + overscan * 2
        );

        const visibleItems = items
            .slice(startIndex, endIndex + 1)
            .map((item, index) => ({
                item,
                index: startIndex + index,
            }));

        return {
            visibleItems,
            startIndex,
            endIndex,
            totalHeight: items.length * itemHeight,
        };
    }, [items, itemHeight, containerHeight, scrollTop, overscan]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const newScrollTop = e.currentTarget.scrollTop;
        setScrollTop(newScrollTop);
        onScroll?.(newScrollTop);
    };

    const scrollToIndex = (index: number) => {
        if (containerRef.current) {
            const scrollTop = index * itemHeight;
            containerRef.current.scrollTop = scrollTop;
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.scrollTop = scrollTop;
        }
    }, [scrollTop]);

    return (
        <div
            ref={containerRef}
            className={cn('overflow-auto', className)}
            style={{ height: containerHeight }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div
                    style={{
                        transform: `translateY(${startIndex * itemHeight}px)`,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                    }}
                >
                    {visibleItems.map(({ item, index }) => (
                        <div
                            key={index}
                            style={{ height: itemHeight }}
                            className="flex items-center"
                        >
                            {renderItem(item, index)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Memoized version for better performance
const MemoizedVirtualizedList = memo(VirtualizedList) as typeof VirtualizedList;

export { MemoizedVirtualizedList as VirtualizedList };
