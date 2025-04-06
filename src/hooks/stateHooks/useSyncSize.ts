import React, { useEffect, useState } from "react";

type Dimension = "width" | "height";

interface UseSyncSizeParams {
  elementRef: React.RefObject<HTMLDivElement | null>;
  dimensions: Array<Dimension>;
}

export function useSyncSize({ elementRef, dimensions }: UseSyncSizeParams) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;
    const resize = () => {
      if (dimensions.includes("height")) {
        setHeight(element.clientHeight);
      }
      if (dimensions.includes("width")) {
        setWidth(element.clientWidth);
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [dimensions, elementRef]);

  return [width, height] as const;
}
