import React, { useRef } from "react";
import clsx from "clsx";
import "./Container.scss";
import Scrollbars from "./Scrollbars/Scrollbars";

interface ContainerProps {
  scrollX?: boolean;
  scrollY?: boolean;
  className?: string;
  children?: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement | null>;
}

function Container({
  scrollX,
  scrollY,
  className,
  children,
  ref: _ref,
}: ContainerProps) {
  const defaultContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = _ref ?? defaultContainerRef;
  return (
    <div className={clsx("container", className)}>
      <div className="container__content" ref={containerRef}>
        {children}
      </div>

      <Scrollbars
        scrollX={scrollX}
        scrollY={scrollY}
        containerRef={containerRef}
      />
    </div>
  );
}

export default Container;
