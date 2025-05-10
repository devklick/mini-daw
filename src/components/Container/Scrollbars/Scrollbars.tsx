import clsx from "clsx";
import React, { CSSProperties, useRef } from "react";
import useScrollbars, {
  useScrollbarReset,
  useScrollbarV2,
} from "./hooks/useScrollbars";

import "./Scrollbars.scss";

interface ScrollbarsProps {
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
   * A reference to the scrollable area within the container.
   */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /**
   * A reference to the content that's rendered within the scrollable container.
   *
   * Since we may need to resize the content within the container,
   * we need a reference to it to apply the resize.
   */
  contentRef: React.RefObject<HTMLDivElement | null>;
}

function Scrollbars({
  scrollX,
  scrollY,
  scrollXGrow,
  scrollYGrow,
  containerRef,
  contentRef,
}: ScrollbarsProps) {
  const sliderXRef = useRef<HTMLDivElement>(null);
  const sliderYRef = useRef<HTMLDivElement>(null);
  const [x, y] = useScrollbars({
    scrollX,
    scrollY,
    scrollXGrow,
    scrollYGrow,
    sliderXRef,
    sliderYRef,
    containerRef,
    contentRef,
  });
  return (
    <>
      {x.enabled && (
        <Scrollbar
          axis="x"
          sliderOffset={x.offset}
          sliderSize={x.size}
          sliderRef={sliderXRef}
        />
      )}
      {y.enabled && (
        <Scrollbar
          axis="y"
          sliderOffset={y.offset}
          sliderSize={y.size}
          sliderRef={sliderYRef}
        />
      )}
    </>
  );
}

interface ScrollbarProps {
  axis: "x" | "y";
  sliderSize: number;
  sliderOffset: number;
  sliderRef: React.RefObject<HTMLDivElement | null>;
}

function Scrollbar({
  axis,
  sliderOffset,
  sliderSize,
  sliderRef,
}: ScrollbarProps) {
  const style: CSSProperties = {};
  if (axis === "x") {
    style.width = sliderSize;
    style.left = sliderOffset;
  } else {
    style.height = sliderSize;
    style.top = sliderOffset;
  }

  return (
    <div className={clsx(`scrollbar`, `scrollbar--${axis}`)}>
      <div
        className={clsx("scrollbar-slider", `scrollbar-slider--${axis}`)}
        style={style}
        ref={sliderRef}
      />
    </div>
  );
}

interface ScrollbarV2Props {
  /**
   * A reference to the scrollable area within the container.
   */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /**
   * A reference to the content that's rendered within the scrollable container.
   *
   * Since we may need to resize the content within the container,
   * we need a reference to it to apply the resize.
   */
  contentRef: React.RefObject<HTMLDivElement | null>;
  axis: "x" | "y";
  grow?: boolean;
}

export function ScrollbarV2({
  axis,
  containerRef,
  contentRef,
  grow,
}: ScrollbarV2Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { offset, size } = useScrollbarV2({
    axis,
    containerRef,
    contentRef,
    enabled: true,
    scrollGrow: grow ?? false,
    sliderRef,
  });
  const style: CSSProperties = {};
  if (axis === "x") {
    style.width = size;
    style.left = offset;
  } else {
    style.height = size;
    style.top = offset;
  }

  return (
    <div className={clsx(`scrollbar`, `scrollbar--${axis}`)}>
      <div
        className={clsx("scrollbar-slider", `scrollbar-slider--${axis}`)}
        style={style}
        ref={sliderRef}
      />
    </div>
  );
}

export default Scrollbars;
