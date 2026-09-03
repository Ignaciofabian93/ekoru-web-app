"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drives one horizontal card rail: the ref to attach, whether either arrow is
 * still live, and the handler that moves it.
 *
 * Every home highlight rebuilt this same block of ref + two booleans +
 * ResizeObserver by hand. That was survivable while each section owned exactly
 * one rail — the marketplace highlight renders two, which cannot share a single
 * ref, so the state has to be per-rail rather than per-component.
 *
 * @param itemCount Re-measures when the rail's contents change; without it the
 * arrows stay disabled after cards arrive, because nothing resized the element.
 */
export function useCardScroller(itemCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState, itemCount]);

  const handleScroll = useCallback((delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  return { scrollRef, canScrollLeft, canScrollRight, handleScroll };
}
