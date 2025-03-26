import React, { useRef } from "react";
import clsx from "clsx";
import "./Container.scss";
import Scrollbars from "./Scrollbars/Scrollbars";

interface ContainerProps {
  scrollX?: boolean;
  scrollY?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function Container({ scrollX, scrollY, className, children }: ContainerProps) {
  const contentContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={clsx("container", className)}>
      <div className="container__content" ref={contentContainerRef}>
        {children}
      </div>

      <Scrollbars
        scrollX={scrollX}
        scrollY={scrollY}
        containerRef={contentContainerRef}
      />
    </div>
  );
}

export default Container;
