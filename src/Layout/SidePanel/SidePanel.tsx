import clsx from "clsx";
import "./SidePanel.scss";
import React from "react";

interface SidePanelProps {
  side: "left" | "right";
  children?: React.ReactNode;
}

function SidePanel({ side, children }: SidePanelProps) {
  return (
    <aside className={clsx("side-panel", `side-panel--${side}`)}>
      {children}
    </aside>
  );
}

export default SidePanel;
