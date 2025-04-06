import React, { useRef } from "react";
import clsx from "clsx";
import "./Container.scss";
import Scrollbars from "./Scrollbars/Scrollbars";

interface ContainerProps {
  /**
   * Whether or not scrolling is enabled along the X axis.
   *
   * If not enabled, the scrollbar will not be rendered. If enabled, the scrollbar
   * will be rendered and persisted, regardless of whether the content overflows
   * the containers boundary.
   */
  scrollX?: boolean;

  /**
   * Whether or not scrolling is enabled along the Y axis.
   *
   * If not enabled, the scrollbar will not be rendered. If enabled, the scrollbar
   * will be rendered and persisted, regardless of whether the content overflows
   * the containers boundary.
   */
  scrollY?: boolean;
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
  /**
   * The content to render within the scrollable container
   */
  children?: React.ReactNode;
  /**
   * A reference to the scrollable area within the container.
   */
  ref?: React.RefObject<HTMLDivElement | null>;
  /**
   * A reference to the content that's rendered within the scrollable container.
   *
   * Since we may need to resize the content within the container,
   * we need a reference to it to apply the resize.
   */
  contentRef: React.RefObject<HTMLDivElement | null>;
  className?: string;

  // TODO: Add option to move viewport by dragging middle mouse button
}

function Container({
  scrollX,
  scrollY,
  scrollXGrow,
  scrollYGrow,
  className,
  children,
  ref: _ref,
  contentRef,
}: ContainerProps) {
  // We need a ref; one may or may not have been provided.
  // Init a fallback ref to use in case we didn't get one.
  const defaultContainerRef = useRef<HTMLDivElement>(null);
  // Decide which ref to use
  const containerRef = _ref ?? defaultContainerRef;

  return (
    <div className={clsx(className, "container")}>
      {/* 
        The container_content is the element that can be scrolled.

        It's a bit misleading that the containerRef is actually used for the container_content element, 
        and the contentRef actually refers to the element that's rendered within container_content.

        // TODO: Consider better naming to clear up this confusion
       */}
      <div className="container__content" ref={containerRef}>
        {children}
      </div>

      <Scrollbars
        scrollX={scrollX}
        scrollY={scrollY}
        scrollXGrow={scrollXGrow}
        scrollYGrow={scrollYGrow}
        containerRef={containerRef}
        contentRef={contentRef}
      />
    </div>
  );
}

export default Container;
