import clsx from "clsx";
import React, { CSSProperties, useRef } from "react";
import useScrollbars from "./hooks/useScrollbars";

import "./Scrollbars.scss";

interface ScrollbarsProps {
  scrollX?: boolean;
  scrollY?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function Scrollbars({ scrollX, scrollY, containerRef }: ScrollbarsProps) {
  const sliderXRef = useRef<HTMLDivElement>(null);
  const sliderYRef = useRef<HTMLDivElement>(null);
  const [x, y] = useScrollbars({
    scrollX,
    scrollY,
    sliderXRef: sliderXRef,
    sliderYRef: sliderYRef,
    containerRef,
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

export default Scrollbars;
