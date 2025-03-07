import { useRef } from "react";
import MenuItems, { MenuItemProps } from "../MenuItems";
import useDetectMouseDownOutside from "../../hooks/mouseHooks/useDetectMouseDownOutside";
import useBindKeyToAction from "../../hooks/keyboardHooks/useBindKeyToAction";

import "./ContextMenu.scss";

interface ContextMenuProps {
  items: Array<MenuItemProps>;
  position: { x: number; y: number };
  close: () => void;
}

function ContextMenu({ items, position, close }: ContextMenuProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useDetectMouseDownOutside({ elementRef, onMouseDown: close });
  useBindKeyToAction({ keys: ["Escape"], actions: [close] });

  return (
    <div
      className="context-menu"
      style={{ left: position.x, top: position.y }}
      ref={elementRef}
    >
      <MenuItems
        items={items}
        position={{ x: 0, y: 0 }}
        positionType="relative"
        close={close}
      />
    </div>
  );
}

export default ContextMenu;
