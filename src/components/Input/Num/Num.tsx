import clsx from "clsx";
import "./Num.scss";
import React from "react";

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
  function handleWheel(e: React.WheelEvent<HTMLInputElement>) {
    if (disableScroll) return;
    e.preventDefault();
    let newValue = value;
    if (e.deltaY < 0) {
      newValue += 1;
    } else {
      newValue -= 1;
    }
    if (min !== undefined && newValue < min) {
      newValue = min;
    }
    if (max !== undefined && newValue > max) {
      newValue = max;
    }
    onChange(newValue);
  }
  return (
    <div className={clsx("number")}>
      {label && <label className="number__label">{label}</label>}
      <input
        className={clsx("number__input", className)}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
        onWheel={handleWheel}
      />
    </div>
  );
}

export default Num;
