import clsx from "clsx";
import useToggle from "../../hooks/stateHooks/useToggle";
import "./SelectList.scss";

interface SelectableItem {
  title: string;
}

interface SelectListProps<Item extends SelectableItem> {
  items: Array<Item>;
  label?: string;
  className?: string;
}

function SelectList<Item extends SelectableItem>({
  items,
  label,
  className,
}: SelectListProps<Item>) {
  const [open, { toggle }] = useToggle(false);

  return (
    <div className={clsx("select-list", className)}>
      <label className="select-list__label">{label}</label>

      <ol className="select-list__items">
        <span onClick={toggle}>{"selected"}</span>
        {open &&
          items.map((item) => (
            <div className="select-list__item">{item.title}</div>
          ))}
        <div className="select-list__item">{"Add"}</div>
      </ol>
    </div>
  );
}

export default SelectList;
