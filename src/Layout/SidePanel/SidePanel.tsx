import React, { useCallback, useEffect, useRef } from "react";
import clsx from "clsx";

import useLayoutStore from "../stores/useLayoutStore";
import useMouseDownOnElement from "../../hooks/mouseHooks/useMouseDownOnElement";

import "./SidePanel.scss";

type CapitalizeWord<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : S;

function capitalize<T extends string>(str: T): CapitalizeWord<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as CapitalizeWord<T>;
}

interface SidePanelProps {
  side: "left" | "right";
  children?: React.ReactNode;
}

function SidePanel({ side, children }: SidePanelProps) {
  const width = useLayoutStore((s) => s[`${side}PanelWidth`]);
  const minWidth = useLayoutStore((s) => s[`${side}PanelMinWidth`]);
  const setWidth = useLayoutStore((s) => s[`set${capitalize(side)}PanelWidth`]);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const [mouseDown] = useMouseDownOnElement({ element: handleRef });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const x = e.clientX;
      const newWidth = side === "left" ? x : window.innerWidth - x;
      if (newWidth >= minWidth) {
        setWidth(newWidth);
      }
    },
    [minWidth, setWidth, side]
  );

  useEffect(() => {
    if (mouseDown) {
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, mouseDown]);

  return (
    <aside
      className={clsx("side-panel", `side-panel--${side}`)}
      style={{ width }}
    >
      <div
        ref={handleRef}
        className={clsx(
          "side-panel__resize-handle",
          `side-panel__resize-handle--${side}`
        )}
      />
      <div className="side-panel__content">{children}</div>
    </aside>
  );
}

export default SidePanel;
