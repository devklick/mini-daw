import React, { useCallback, useEffect, useRef } from "react";
import "./ArrangerTracks.scss";

interface ArrangerTracksProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function ArrangerTracks({ containerRef }: ArrangerTracksProps) {
  const ref = useRef<HTMLDivElement>(null);
  const width = useRef<number>(0);

  const handleResize = useCallback(() => {
    if (containerRef.current) {
      width.current = Math.max(width.current, containerRef.current.clientWidth);
    }
    if (ref.current) {
      ref.current.style.width = `${width.current}px`;
    }
  }, [containerRef]);

  useEffect(() => {
    if (!containerRef.current) return;

    handleResize();

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef, handleResize]);

  function handleScroll() {
    width.current = width.current + 10;
    if (ref.current) {
      ref.current.style.width = `${width.current}px`;
    }
    handleResize();
  }

  return (
    <div
      className="arranger-tracks"
      style={{ width: 3000, height: 3000 }}
      ref={ref}
      onWheel={handleScroll}
    ></div>
  );
}

export default ArrangerTracks;
