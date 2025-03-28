import { useCallback, useEffect, useRef, useState } from "react";
import { uppercase } from "../../../../utils/stringUtils";

interface UseScrollbarsParams {
  scrollX?: boolean;
  scrollY?: boolean;
  sliderXRef: React.RefObject<HTMLDivElement | null>;
  sliderYRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function useScrollbars({
  containerRef,
  scrollX,
  scrollY,
  sliderXRef: sliderXRef,
  sliderYRef: sliderYRef,
}: UseScrollbarsParams) {
  const x = useScrollbar({
    axis: "x",
    enabled: scrollX ?? false,
    containerRef,
    sliderRef: sliderXRef,
  });
  const y = useScrollbar({
    axis: "y",
    enabled: scrollY ?? false,
    containerRef,
    sliderRef: sliderYRef,
  });
  return [x, y] as const;
}

interface UseScrollbarParams {
  axis: "x" | "y";
  enabled: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  sliderRef: React.RefObject<HTMLDivElement | null>;
}

function useScrollbar({
  axis,
  containerRef,
  enabled,
  sliderRef,
}: UseScrollbarParams) {
  const [values, setValues] = useState<{ size: number; offset: number }>({
    offset: 0,
    size: 0,
  });
  const isDragging = useRef(false);
  const dragStart = useRef(0);
  const dragStartScrollOffset = useRef(0);

  // Drag movement
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;

      const container = containerRef.current;
      const { scrollHeight, clientHeight, scrollWidth, clientWidth } =
        container;

      let clientSize;
      let scrollSize;

      if (axis === "x") {
        clientSize = clientWidth;
        scrollSize = scrollWidth;
      } else {
        clientSize = clientHeight;
        scrollSize = scrollHeight;
      }

      // Calculate movement distance
      const delta = event[`client${uppercase(axis)}`] - dragStart.current;

      // Calculate the max offset that we can have
      const maxSliderOffset = clientSize - values.size;

      // Calculate the new slider offset.
      const newSliderOffset = Math.min(
        // Where the user is trying to drag to, or 0 (greatest)
        Math.max(values.offset + delta, 0),
        maxSliderOffset
      );

      // Convert the sliders movement into an offset
      const newScrollOffset =
        (newSliderOffset / maxSliderOffset) * (scrollSize - clientSize);

      if (axis === "x") {
        container.scrollLeft = newScrollOffset;
      } else {
        container.scrollTop = newScrollOffset;
      }
    },
    [axis, containerRef, values.offset, values.size]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;

    // Done with the dragging, so we can remove these listeners.
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  /**
   * Handle scrolling via dragging scrollbar
   */
  useEffect(() => {
    const scroller = sliderRef.current;
    if (!scroller || !enabled) return;
    const handleMouseDown = (event: MouseEvent) => {
      isDragging.current = true;
      // Need to know where the drag starts from, which depends on the axis the scrollbar is for
      dragStart.current = event[`client${uppercase(axis)}`] || 0;

      // Need to know the current offset for the scrollbar, which again depends on the axis
      dragStartScrollOffset.current =
        (axis === "x"
          ? containerRef.current?.scrollLeft
          : containerRef.current?.scrollTop) || 0;

      // Since we know we're now dragging the scroller, lets hook up the listeners
      // for movement and completing the drag.
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };
    scroller.addEventListener("mousedown", handleMouseDown);

    return () => {
      scroller.removeEventListener("mousedown", handleMouseDown);
    };
  }, [axis, containerRef, enabled, handleMouseMove, handleMouseUp, sliderRef]);

  /**
   * Handle scrolling via mouse wheel
   */
  useEffect(() => {
    const element = containerRef.current;
    if (!element || !enabled) return;

    const updateScroll = () => {
      let clientSize: number;
      let scrollSize: number;
      let scrollOffset: number;

      // Grab the relevant props based on the axis the scrollbar is for
      if (axis === "x") {
        clientSize = element.offsetWidth;
        scrollSize = element.scrollWidth;
        scrollOffset = element.scrollLeft;
      } else {
        clientSize = element.offsetHeight;
        scrollSize = element.scrollHeight;
        scrollOffset = element.scrollTop;
      }

      // Calculate the size of the scrollbar (width if x, height if y),
      const minSize = 30;
      const size = Math.max(
        // TODO: Avoid hardcoding magic number 4.
        // This relates to the padding within the scrollbar
        (clientSize / scrollSize) * clientSize - 4,
        minSize
      );
      // Calculate the offset off the scrollbar (left if x, top if y);
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
