"use client";

import { useRef, useEffect, useCallback } from "react";

interface ScrollPickerProps {
  items: string[];
  value: string;
  onChange: (value: string) => void;
}

const ITEM_HEIGHT = 40;

export default function ScrollPicker({ items, value, onChange }: ScrollPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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
    if (index >= 0) scrollToIndex(index, false);
  }, [items, value, scrollToIndex]);

  function handleScroll() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;
      const index = Math.round(container.scrollTop / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, items.length - 1));
      scrollToIndex(clamped);
      onChange(items[clamped]);
    }, 60);
  }

  return (
    <div className="relative" style={{ height: ITEM_HEIGHT * 3 }}>
      {/* Selection bar */}
      <div
        className="absolute left-1 right-1 rounded-lg bg-white/10 pointer-events-none z-10"
        style={{ top: ITEM_HEIGHT, height: ITEM_HEIGHT }}
      />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scrollbar-hide"
        style={{ scrollSnapType: "y mandatory" }}
      >
        <div style={{ height: ITEM_HEIGHT }} />
        {items.map((item, i) => {
          return (
            <div
              key={item}
              onClick={() => {
                scrollToIndex(i);
                onChange(items[i]);
              }}
              className="flex items-center justify-center text-base text-white cursor-pointer"
              style={{ height: ITEM_HEIGHT, scrollSnapAlign: "center" }}
            >
              {item}
            </div>
          );
        })}
        <div style={{ height: ITEM_HEIGHT }} />
      </div>

      {/* Fades */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-neutral-900 to-transparent pointer-events-none z-20 rounded-t-xl" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none z-20 rounded-b-xl" />
    </div>
  );
}
