import React, { useState } from "react";
import clsx from "clsx";

import { useDetectMouseDownOutside } from "../../hooks/mouseHooks";

import "./SelectList.scss";

interface SelectListItem<ItemId extends string> {
  text: string;
  id: ItemId;
  selected?: boolean;
}

interface SelectListProps<ItemId extends string> {
  items: Array<SelectListItem<ItemId>>;
  onChanged: (id: string) => void;
  className?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
  onOpen?(): void;
  onClose?(): void;
}

function SelectList<itemId extends string>({
  items,
  onChanged,
  className,
  ref,
  onClose,
  onOpen,
}: SelectListProps<itemId>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function close() {
    setIsOpen(false);
    onClose?.();
  }
  function open() {
    setIsOpen(true);
    onOpen?.();
  }

  useDetectMouseDownOutside({ elementRef: ref, onMouseDown: close });

  function onClickerClicked() {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }

  function onItemClicked(itemId: string) {
    onChanged(itemId);
    close();
  }

  return (
    <div
      className={clsx("select-list", className, {
        "select-list--open": isOpen,
      })}
      ref={ref}
    >
      <div
        className={clsx("select-list__clicker", {
          "select-list__clicker--open": isOpen,
        })}
        onClick={onClickerClicked}
      >
        <span className="select-list__current">
          {items.find((o) => o.selected)?.text}
        </span>
      </div>
      {isOpen && (
        <div className="select-list__items">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClicked(item.id)}
              className={clsx("select-list__item", {
                "select-list__item--selected": item.selected,
              })}
            >
              <span className="select-list__item-text">{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectList;
