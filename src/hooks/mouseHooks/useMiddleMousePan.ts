import React, { useEffect, useRef } from "react";
import { MouseEventButton } from "../../utils/mouseUtils";

interface UseMiddleMousePanParams {
  /**
   * The scrollable container, who's scroll position
   * should be updated when panning with middle-mouse button
   */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /**
   * The content within the container, who's dimensions should be updated
   * when growing the size if panning past the upper dimensions.
   *
   * Depends on `scrollXGrow` and `scrollYGrow`.
   */
  contentRef: React.RefObject<HTMLDivElement | null>;
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
}

export function useMiddleMousePan({
  containerRef,
  contentRef,
  scrollXGrow,
  scrollYGrow,
}: UseMiddleMousePanParams) {
  const startX = useRef(0);
  const startY = useRef(0);
  const isPanning = useRef(false);
  const contentDimensions = useRef({ height: 0, width: 0 });

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const resize = () => {
      const content = contentRef.current;
      if (!content) return;

      contentDimensions.current = {
        height: content.clientHeight,
        width: content.clientWidth,
      };
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === MouseEventButton.Middle) {
        isPanning.current = true;
        startX.current = e.clientX + container.scrollLeft;
        startY.current = e.clientY + container.scrollTop;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning.current) return;
      const content = contentRef.current;
      if (!isPanning.current || !content) return;

      const x = e.clientX - startX.current;
      const y = e.clientY - startY.current;
      container.scrollLeft = -x;
      container.scrollTop = -y;

      if (
        scrollXGrow &&
        container.scrollWidth === container.clientWidth + container.scrollLeft
      ) {
        contentDimensions.current.width += 100;
        content.style.width = `${contentDimensions.current.width}px`;
      }
      if (
        scrollYGrow &&
        container.scrollHeight === container.clientHeight + container.scrollTop
      ) {
        contentDimensions.current.height += 100;
        content.style.height = `${contentDimensions.current.height}px`;
      }
    };

    const handleMouseUp = () => {
      isPanning.current = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Cleanup the event listeners when the component unmounts
    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanning, containerRef, contentRef, scrollXGrow, scrollYGrow]);

  return isPanning;
}
