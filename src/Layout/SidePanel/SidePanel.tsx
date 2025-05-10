import React, { useCallback, useEffect, useRef } from "react";
import clsx from "clsx";

import useLayoutStore from "../stores/useLayoutStore";
import { useMouseDownOnElement } from "../../hooks/mouseHooks";
import { capitalize } from "../../utils/stringUtils";

import "./SidePanel.scss";

interface SidePanelProps {
  side: "left" | "right";
  title: string;
  children?: React.ReactNode;
}

function SidePanel({ title, side, children }: SidePanelProps) {
  const width = useLayoutStore((s) => s[`${side}PanelWidth`]);
  const minWidth = useLayoutStore((s) => s[`${side}PanelMinWidth`]);
  const defaultWidth = useLayoutStore((s) => s[`${side}PanelDefaultWidth`]);
  const setWidth = useLayoutStore((s) => s[`set${capitalize(side)}PanelWidth`]);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const [mouseDown] = useMouseDownOnElement({ element: handleRef });
  const open = width > 0;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const x = e.clientX;
      const newWidth = side === "left" ? x : window.innerWidth - x;
      if (newWidth >= minWidth) {
        setWidth(newWidth);
      } else {
        setWidth(0);
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

  function handleClick() {
    if (!open) {
      setWidth(defaultWidth);
    }
  }
  function doubleClickHandle() {
    setWidth(open ? 0 : defaultWidth);
  }

  return (
    <aside
      className={clsx("side-panel", `side-panel--${side}`, {
        ["side-panel--closed"]: !open,
      })}
      style={{ width }}
      onClick={handleClick}
    >
      <span
        className={clsx("side-panel__title", `side-panel__title--${side}`, {
          ["side-panel__title--vertical"]: !open,
        })}
      >
        {title}
      </span>
      <div
        ref={handleRef}
        onDoubleClick={doubleClickHandle}
        className={clsx(
          "side-panel__resize-handle",
          `side-panel__resize-handle--${side}`,
          {
            "side-panel__resize-handle--disabled": !open,
          }
        )}
      />
      {open && <div className="side-panel__content">{children}</div>}
    </aside>
  );
}

export default SidePanel;
