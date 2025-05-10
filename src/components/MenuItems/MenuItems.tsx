import { useEffect, useRef, useState } from "react";

import "./MenuItems.scss";

import clsx from "clsx";

export interface MenuItemsProps {
  items: Array<MenuItemProps>;
  position: { x: number; y: number };
  positionType: "relative" | "absolute";
  close(): void;
  closeOnClick?: boolean;
}

export interface MenuItemProps {
  title: string;
  action?: () => void;
  items?: Array<MenuItemProps>;
  close(): void;
  closeOnClick?: boolean;
}

function MenuItems({
  items,
  position: { x, y },
  positionType,
  close,
  closeOnClick = true,
}: MenuItemsProps) {
  return (
    <div
      className={clsx("menu-items", `menu-items--${positionType}`)}
      style={{ left: x, top: y }}
    >
      <div className="menu-items__content">
        {items.map((item, i) => (
          <MenuItem
            title={item.title}
            action={item.action}
            items={item.items}
            itemNo={i + 1}
            position={{ x, y }}
            key={`${item.title}-${i}`}
            close={close}
            closeOnClick={closeOnClick}
          />
        ))}
      </div>
    </div>
  );
}

function MenuItem({
  title,
  action,
  items,
  itemNo,
  position,
  close,
  closeOnClick = true,
}: MenuItemProps & {
  itemNo: number;
  position: { x: number; y: number };
}) {
  const hoverDelayMs = 400;
  const elementRef = useRef<HTMLDivElement>(null);
  const elementPosition = useRef({ ...position });
  const hoverOpenDelayRef = useRef<number>(null);
  const hoverCloseDelayRef = useRef<number>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (hoverCloseDelayRef.current) clearTimeout(hoverCloseDelayRef.current);
      if (hoverOpenDelayRef.current) clearTimeout(hoverOpenDelayRef.current);
    };
  }, []);

  useEffect(() => {
    const rect = elementRef.current?.getBoundingClientRect();
    elementPosition.current.x = rect?.width ?? 0;
    elementPosition.current.y = (rect?.height ?? 0) * (itemNo - 1);
  }, [elementRef, itemNo, position]);

  function handleOnMouseEnter() {
    // Now that we've entered the item, if it's open
    // and there's a pending timeout to close it,
    // we want to cancel that
    if (open && hoverCloseDelayRef.current) {
      clearTimeout(hoverCloseDelayRef.current);
      hoverCloseDelayRef.current = null;
    }

    // If it's not open yet and there's no pending
    // timeout to open it, lets start one.
    if (!open && !hoverOpenDelayRef.current) {
      hoverOpenDelayRef.current = setTimeout(() => {
        if (!open) {
          setOpen(true);
          hoverOpenDelayRef.current = null;
        }
      }, hoverDelayMs);
    }
  }
  function handleOnMouseLeave() {
    // Now that we've left the item, if it's closed
    // and there's a pending timeout to open it,
    // we want to cancel that
    if (!open && hoverOpenDelayRef.current) {
      clearTimeout(hoverOpenDelayRef.current);
      hoverOpenDelayRef.current = null;
    }

    // If it's not closed yet and there's no pending
    // timeout to close it, lets start one.
    if (open && !hoverCloseDelayRef.current) {
      hoverCloseDelayRef.current = setTimeout(() => {
        if (open) {
          setOpen(false);
          hoverCloseDelayRef.current = null;
        }
      }, hoverDelayMs);
    }
  }

  function handleOnClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (action) {
      action();
      if (closeOnClick) {
        close();
      }
    } else if (items) {
      setOpen(!open);
    }
  }

  return (
    <div
      className="menu-item"
      ref={elementRef}
      onClick={handleOnClick}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      <span>{title}</span>
      {items && open && (
        <MenuItems
          items={items}
          position={{ ...elementPosition.current }}
          positionType="absolute"
          close={close}
          closeOnClick={closeOnClick}
        />
      )}
    </div>
  );
}

export default MenuItems;
