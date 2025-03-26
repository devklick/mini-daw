import clsx from "clsx";
import { CSSProperties } from "react";
import useScrollbars from "./hooks/useScrollbars";

import "./Scrollbars.scss";

interface ScrollbarsProps {
  scrollX?: boolean;
  scrollY?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function Scrollbars({ scrollX, scrollY, containerRef }: ScrollbarsProps) {
  const [x, y] = useScrollbars({ scrollX, scrollY, containerRef });
  return (
    <>
      {x.enabled && (
        <Scrollbar axis="x" sliderOffset={x.offset} sliderSize={x.size} />
      )}
      {y.enabled && (
        <Scrollbar axis="y" sliderOffset={y.offset} sliderSize={y.size} />
      )}
    </>
  );
}

interface ScrollbarProps {
  axis: "x" | "y";
  sliderSize: number;
  sliderOffset: number;
}

function Scrollbar({ axis, sliderOffset, sliderSize }: ScrollbarProps) {
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
      />
    </div>
  );
}

export default Scrollbars;
