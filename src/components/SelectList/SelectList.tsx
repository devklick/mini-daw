import { useState } from "react";
import clsx from "clsx";

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
}

function SelectList<itemId extends string>({
  items,
  onChanged,
  className,
}: SelectListProps<itemId>) {
  const [open, setOpen] = useState<boolean>(false);

  function onClickerClicked() {
    setOpen(!open);
  }

  function onItemClicked(itemId: string) {
    setOpen(false);
    onChanged(itemId);
  }

  return (
    <>
      <div
        className={clsx("select-list", className, {
          "select-list--open": open,
        })}
      >
        <div
          className={clsx("select-list__clicker", {
            "select-list__clicker--open": open,
          })}
          onClick={onClickerClicked}
        >
          <span className="select-list__current">
            {items.find((o) => o.selected)?.text}
          </span>
        </div>
        {open && (
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
    </>
  );
}

export default SelectList;
