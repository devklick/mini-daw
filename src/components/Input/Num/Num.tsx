import clsx from "clsx";

import { useRef } from "react";

import { useScrollToChange } from "../../../hooks/mouseHooks";

import "./Num.scss";

interface NumProps {
  value: number;
  onChange(value: number): void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
  disableScroll?: boolean;
}

function Num({
  onChange,
  value,
  max,
  min,
  label,
  className,
  disableScroll,
}: NumProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useScrollToChange(inputRef, {
    value,
    min,
    max,
    onChange,
    disabled: disableScroll,
  });

  return (
    <div className={clsx("number")}>
      {label && <label className="number__label">{label}</label>}
      <input
        ref={inputRef}
        className={clsx("number__input", className)}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
      />
    </div>
  );
}

export default Num;
