import React, { useRef } from "react";
import useContextMenu from "./hooks/useContextMenu";
import { MenuItemProps } from "../MenuItems";
import ContextMenu from "./ContextMenu";

import "./ContextMenu.scss";

interface ContextMenuTargetProps {
  items: Array<Omit<MenuItemProps, "close">>;
  children: React.ReactNode;
}

/**
 * Creates an element bound to it's parent elements dimensions. This element
 * serves as the click area to detect a right-click, and opens the context
 * menu when the right-click happens.
 */
export function ContextMenuTarget({ children, items }: ContextMenuTargetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const contextMenu = useContextMenu({ targetElement: ref });
  return (
    <div ref={ref} className="context-menu-target">
      {contextMenu.isOpen && (
        <ContextMenu
          close={() => contextMenu.close()}
          position={contextMenu.position}
          items={items.map((item) => ({ ...item, close }))}
        />
      )}
      {children}
    </div>
  );
}

export default ContextMenuTarget;
