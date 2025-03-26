import { useEffect, useState } from "react";

interface UseScrollbarsParams {
  scrollX?: boolean;
  scrollY?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function useScrollbars({
  containerRef,
  scrollX,
  scrollY,
}: UseScrollbarsParams) {
  const x = useScrollbar({
    axis: "x",
    enabled: scrollX ?? false,
    containerRef,
  });
  const y = useScrollbar({
    axis: "y",
    enabled: scrollY ?? false,
    containerRef,
  });
  return [x, y] as const;
}

interface UseScrollbarParams {
  axis: "x" | "y";
  enabled: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function useScrollbar({ axis, containerRef, enabled }: UseScrollbarParams) {
  const [values, setValues] = useState<{ size: number; offset: number }>({
    offset: 0,
    size: 0,
  });

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !enabled) return;

    const updateScroll = () => {
      let clientSize: number;
      let scrollSize: number;
      let scrollOffset: number;

      if (axis === "x") {
        clientSize = element.offsetWidth;
        scrollSize = element.scrollWidth;
        scrollOffset = element.scrollLeft;
      } else {
        clientSize = element.offsetHeight;
        scrollSize = element.scrollHeight;
        scrollOffset = element.scrollTop;
      }

      // TODO: Avoid hardcoding magic number 4.
      // This relates to the padding within the scrollbar
      const minSize = 30;
      const size = Math.max(
        (clientSize / scrollSize) * clientSize - 4,
        minSize
      );
      const maxOffset = clientSize - size;
      const offset =
        (scrollOffset / (scrollSize - clientSize)) * maxOffset || 0;

      setValues({ offset, size });
    };

    updateScroll();

    const observer = new ResizeObserver(updateScroll);
    observer.observe(element);

    element.addEventListener("scroll", updateScroll);
    return () => {
      element.removeEventListener("scroll", updateScroll);
      observer.disconnect();
    };
  }, [axis, containerRef, enabled]);

  return { enabled, ...values } as const;
}

export default useScrollbars;
