import React, { useCallback, useEffect, useRef, useState } from "react";
import { capitalize, uppercase } from "../../../../utils/stringUtils";

interface UseScrollbarsParams {
  scrollX?: boolean;
  scrollY?: boolean;
  sliderXRef: React.RefObject<HTMLDivElement | null>;
  sliderYRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Whether or not the user can continue scrolling past the current width of
   * the container to increase the containers width.
   */
  scrollXGrow?: boolean;
  /**
   * Whether or not the user can continue scrolling past the current height of
   * the container to increase the containers height.
   */
  scrollYGrow?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

function useScrollbars({
  containerRef,
  scrollX,
  scrollY,
  sliderXRef,
  sliderYRef,
  scrollXGrow,
  scrollYGrow,
  contentRef,
}: UseScrollbarsParams) {
  const x = useScrollbar({
    axis: "x",
    enabled: scrollX ?? false,
    containerRef,
    contentRef,
    sliderRef: sliderXRef,
    scrollGrow: scrollXGrow ?? false,
  });
  const y = useScrollbar({
    axis: "y",
    enabled: scrollY ?? false,
    containerRef,
    contentRef,
    sliderRef: sliderYRef,
    scrollGrow: scrollYGrow ?? false,
  });
  return [x, y] as const;
}

interface UseScrollbarParams {
  axis: "x" | "y";
  enabled: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  sliderRef: React.RefObject<HTMLDivElement | null>;
  scrollGrow: boolean;
}

function useScrollbar({
  axis,
  containerRef,
  enabled,
  sliderRef,
  contentRef,
  scrollGrow,
}: UseScrollbarParams) {
  /**
   * The values that represents the size and position of the scrollable/draggable
   * area within the scrollbar.
   *  - The size is the width or height (depending on axis)
   *  - The offset is how far down/along is is currently scrolled/dragged.
   */
  const [values, setValues] = useState<{ size: number; offset: number }>({
    offset: 0,
    size: 0,
  });
  /**
   * Keep track of the scrollable containers dimensions, as we may need these
   * if we are to grow/shrink the content element (i.e. if scrollGrow enabled).
   */
  const contentDimensions = useRef<{ width: number; height: number }>({
    height: 0,
    width: 0,
  });
  const isDragging = useRef(false);
  const dragStart = useRef(0);
  const dragStartScrollOffset = useRef(0);
  const isShiftDown = useRef(false);

  /**
   * Handle dragging the draggable area within the scrollbar
   * on mouse down + move
   */
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

  /**
   * Reset dragging when mouse is no longer down
   */
  const handleMouseUp = useCallback(() => {
    isDragging.current = false;

    // Done with the dragging, so we can remove these listeners.
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  /**
   * Calculate the size and offset of the scrollbar position.
   * This should be done whenever the user scrolls or a resize happens.
   */
  const calcScrollValues = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    let clientSize: number;
    let scrollSize: number;
    let scrollOffset: number;

    // Grab the relevant props based on the axis the scrollbar is for
    if (axis === "x") {
      clientSize = container.offsetWidth;
      scrollSize = container.scrollWidth;
      scrollOffset = container.scrollLeft;
    } else {
      clientSize = container.offsetHeight;
      scrollSize = container.scrollHeight;
      scrollOffset = container.scrollTop;
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
    const offset = (scrollOffset / (scrollSize - clientSize)) * maxOffset || 0;

    setValues({ offset, size });
  }, [axis, containerRef]);

  /**
   * Coordinate the actions required whenever a resize happens.
   */
  const handleResize = useCallback(() => {
    // Re-calculate the scroll values, as these will change on resize
    calcScrollValues();

    // Capture the current dimensions of the content element
    const content = contentRef.current;
    if (!content) return;

    contentDimensions.current = {
      height: content.clientHeight,
      width: content.clientWidth,
    };
  }, [contentRef, calcScrollValues]);

  /**
   * Handle moving the scroll position by dragging the scrollbar
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
    const container = containerRef.current;
    if (!container || !enabled) return;

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    container.addEventListener("scroll", calcScrollValues);
    return () => {
      container.removeEventListener("scroll", calcScrollValues);
      observer.disconnect();
    };
  }, [axis, containerRef, enabled, handleResize, calcScrollValues]);

  /**
   * Capture when Shift is held down, as this is used to differentiate between
   * scrolling the Y axis and scrolling the X axis.
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        isShiftDown.current = true;
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        isShiftDown.current = false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  /**
   * Handle resizing the content when scrolling.
   *
   * The idea here is to create a kind of infinitely growing scroll.
   */
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!content || !container || !enabled || !scrollGrow) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (
        (isShiftDown.current && axis === "x") ||
        (!isShiftDown.current && axis === "y")
      ) {
        const wh = axis === "x" ? "width" : "height";

        // TODO: Need to update this so as to only grow the scrollable area
        // when the scroller is current at the end of the area.

        // If scrolling down/right, we want to grow the area
        if (event.deltaY > 0) {
          contentDimensions.current[wh] += 10;
        }
        // If scrolling up/left, we want to shrink the area.
        // However this doesnt work, and I CBA to debug it, so comment out for now
        // else if (event.deltaY < 0) {
        //   containerDimensions.current[wh] = Math.max(
        //     containerDimensions.current[wh] - 10,
        //     container[`scroll${capitalize(wh)}`]
        //   );
        // }
        content.style[wh] = `${contentDimensions.current[wh]}px`;
      }
    };
    container.addEventListener("wheel", handleWheel);
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [contentRef, containerRef, enabled, scrollGrow, axis]);

  return { enabled, ...values } as const;
}

export default useScrollbars;
