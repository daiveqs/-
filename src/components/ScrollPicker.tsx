"use client";

import { useRef, useEffect, useCallback } from "react";

interface ScrollPickerProps {
  items: string[];
  value: string;
  onChange: (value: string) => void;
}

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 5;

export default function ScrollPicker({ items, value, onChange }: ScrollPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({
      top: index * ITEM_HEIGHT,
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  useEffect(() => {
    const index = items.indexOf(value);
    if (index >= 0) {
      scrollToIndex(index, false);
    }
  }, [items, value, scrollToIndex]);

  function handleScroll() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    isScrollingRef.current = true;

    timeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      const container = containerRef.current;
      if (!container) return;

      const index = Math.round(container.scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
      scrollToIndex(clampedIndex);
      onChange(items[clampedIndex]);
    }, 80);
  }

  const paddingItems = Math.floor(VISIBLE_COUNT / 2);

  return (
    <div className="relative" style={{ height: ITEM_HEIGHT * VISIBLE_COUNT }}>
      {/* Selection highlight */}
      <div
        className="absolute left-0 right-0 bg-neutral-800 rounded-lg pointer-events-none z-10"
        style={{ top: ITEM_HEIGHT * paddingItems, height: ITEM_HEIGHT }}
      />
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-neutral-900 to-transparent pointer-events-none z-20" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none z-20" />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {/* Top padding */}
        {Array.from({ length: paddingItems }).map((_, i) => (
          <div key={`top-${i}`} style={{ height: ITEM_HEIGHT }} />
        ))}

        {items.map((item) => (
          <div
            key={item}
            className="flex items-center justify-center text-lg font-medium text-white snap-center"
            style={{ height: ITEM_HEIGHT, scrollSnapAlign: "center" }}
          >
            {item}
          </div>
        ))}

        {/* Bottom padding */}
        {Array.from({ length: paddingItems }).map((_, i) => (
          <div key={`bottom-${i}`} style={{ height: ITEM_HEIGHT }} />
        ))}
      </div>
    </div>
  );
}
